import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NavigationService} from "../../services/navigation.service";
import {FireService} from "../../services/fire.service";
import {locations} from "../../../assets/json/locations";
import {Subject, take} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef?: BsModalRef;
  data = [];
  selected = '';
  isLoading = false;
  //activeFilter = 'f-1';

  /*nav = [
    {id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: any) => w},
    {id: 'f-2',  title: '',  icon: 'shield-1-2', query: (w: any) => w},
    {id: 'f-3',  title: '~',   icon: 'shield-2', query: (w: any) => w.wave_system !== 'standing-wave' && w.wave_system !== 'river'},
    {id: 'f-4',  title: 'S',   icon: 'shield-3', query: (w: any) => w.wave_system === 'standing-wave'},
    {id: 'f-5',  title: 'R',   icon: 'shield-4', query: (w: any) => w.wave_system === 'river'},
    {id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: any) => w.wave_system !== 'river'},
    {id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: any) => w.status !== 'planned' && w.status !== 'permanently closed' || (w.status === 'open only summer season' && this.isSummer)},
    {id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: any) => w.status === 'planned'},
    {id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: any) => w.status === 'permanently closed' || (w.status === 'open only summer season' && !this.isSummer)},
    {id: 'f-10', title: '<8',  icon: 'shield-0', query: (w: any) => w.minimum_age < 8}
  ];*/

  nav = [
    {id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: any) => w},
    {id: 'f-2',  title: '',  icon: 'shield-1-2', query: (w: any) => w},
    {id: 'f-3',  title: '~',   icon: 'shield-2', query: (w: any) => w.wave_system !== 'standing-wave' && w.wave_system !== 'river'},
    {id: 'f-4',  title: 'S',   icon: 'shield-3', query: (w: any) => w.wave_system === 'standing-wave'},
    {id: 'f-5',  title: 'R',   icon: 'shield-4', query: (w: any) => w.wave_system === 'river'},
    {id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: any) => w.wave_indoor},
    {id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: any) => w.status !== 'permanently closed' && this.isOpenedLocation(w.commissioning_date) || (w.status === 'open only summer season' && this.isSummer)},
    {id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: any) => w.status === 'planned' || !this.isOpenedLocation(w.commissioning_date)},
    {id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: any) => w.status === 'permanently closed' && this.isOpenedLocation(w.commissioning_date)},
    {id: 'f-10', title: 'K',  icon: 'shield-0', query: (w: any) => w.minimum_age <= 8}
  ];
  @ViewChild('bookingModal', {static: true}) bookingModal!: TemplateRef<any>
  // @ts-ignore
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  // @ts-ignore
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
  infoContent: any;
  // @ts-ignore
  center: google.maps.LatLngLiteral;
  markers: any[] = [];
  activeFilters: any[] = [];
  height: string | number = 500;
  zoom = 2;
  isFiltersShown = false;
  isMap: boolean;
  // @ts-ignore
  options: google.maps.MapOptions = {
    gestureHandling: 'greedy',
    disableDefaultUI: true,
    mapTypeId: 'terrain',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 500,
    minZoom: 0,
    styles: GoogleMapConfig.styles
  };
  nearestLocation: any;

  browserRefresh?: boolean;
  destroyer$ = new Subject();

  constructor(
    private fireService: FireService,
    private router: Router,
    private modalService: BsModalService,
    private navService: NavigationService
  ) {
    this.browserRefresh = this.navService.browserRefreshed;
    this.isLoading = this.browserRefresh;
    sessionStorage.setItem('prevRoutes', JSON.stringify([]));

    !sessionStorage.getItem('homePageMode') ? (
        this.isMap = true
    ) : (
        this.isMap = sessionStorage.getItem('homePageMode') === 'map'
    );
  }

  get isSummer(): boolean {
    const month = new Date().getMonth() + 1;
    return month > 6 && month < 9
  }

  ngOnInit() {
    this.height = (window.innerHeight - (window.innerWidth < 980 ? 171 : 206)) + 'px';
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.fireService.onGetCollection('locations');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.data.length = 0;
      this.data = resp.filter((location: any) => location.post && location.post.title);

      if (JSON.parse(sessionStorage.getItem('filters')!)?.length > 1) {
        JSON.parse(sessionStorage.getItem('filters')!).forEach((f: any) => {
          const filter = this.nav.find(i => f === i.id);
          this.onFilter(filter);
        })
      } else if (JSON.parse(sessionStorage.getItem('filters')!)?.length === 1) {
        const filter = this.nav.find(i => JSON.parse(sessionStorage.getItem('filters')!)[0] === i.id)
        this.onFilter(filter);
      } else {
        this.onFilter(this.nav[0]);
      }

        if (!sessionStorage.getItem('homeModalShown')) {
          this.findClosestMarker();
        } else {
          this.browserRefresh
            ? (setTimeout(() => {
              this.isLoading = false;
            }, 1000))
            : (this.isLoading = false);
        }
    });
  }

  onGetMarkers(arr: any[]) {
    this.markers.length = 0;
    arr.forEach(location => {

      const destination = location.visit_address && location.visit_address.lat && location.visit_address.lng ? location.visit_address.lat + ',' + location.visit_address.lng : '';
      const origin = this.center && this.center.lat && this.center.lng ? this.center.lat + ',' + this.center.lng : '';
      this.markers.push(
        {
          position: {
            lat: Number(location.visit_address.lat),
            lng: Number(location.visit_address.lng),
          },
          direction: 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=driving',
          title: location.post.title,
          name: location.post.name,
          reflink: location.reflink,
          status: location.status === 'permanently closed' && this.isOpenedLocation(location.waves[0].commissioning_date) ? 'closed' : 'opened',
          options: {
            icon: this.activeFilters.length > 1
                ? '../assets/icons/multiple-filter.png'
                : '../assets/icons/' + this.activeFilters[0].id + '.png'
          },
        }
      )
    })
  }

  ngAfterViewInit() {
    if(this.map) {
      this.map.googleMap?.setOptions({styles: this.options.styles});
    }
  }

  ngOnDestroy() {
    this.destroyer$.complete();
  }

  onToggleFilters() {
    this.isFiltersShown = !this.isFiltersShown;
  }

  onToggleLayout() {
    this.isMap = !this.isMap;
    sessionStorage.setItem('homePageMode', this.isMap ? 'map' : 'list');
  }

  zoomIn() {
    // @ts-ignore
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }
  zoomOut() {
    // @ts-ignore
    if (this.zoom > this.options.minZoom) this.zoom--;
  }
  // @ts-ignore
  click(event: google.maps.MouseEvent) {
    console.log(event);
  }

  openInfo(marker: any, content: any) {
    this.infoContent = content;
    this.info.open(marker);

    let pos = marker._position;
    pos.lat = pos.lat + 7;

    this.map.googleMap?.panTo(pos);
  }

  onFilter(filter?: any) {
    let filteredGatherData: any[] = [...this.data];

    if(filter) {
      if (filter.type === 'keyup') {
        this.onGetMarkers(this.data.filter((location: any) => location.post.title.toLowerCase().includes(filter.target.value.toLowerCase())));
      } else if (filter.id !== 'f-1') {
        if (this.activeFilters.includes(this.nav[0])) {
          this.activeFilters.shift();
        } else if (filter.id === 'f-7' && this.activeFilters.includes(this.nav[8])) {
          const removeIndex = this.activeFilters.findIndex(f => f.id === this.nav[8].id);
          this.activeFilters.splice(removeIndex, 1);
        } else if (filter.id === 'f-9' && this.activeFilters.includes(this.nav[6])) {
          const removeIndex = this.activeFilters.findIndex(f => f.id === this.nav[6].id);
          this.activeFilters.splice(removeIndex, 1);
        }

        if (!this.activeFilters.includes(filter)) {
          this.activeFilters.push(filter);
        } else {
          const removeIndex = this.activeFilters.findIndex(f => f.id === filter.id);
          this.activeFilters.splice(removeIndex, 1);
          if (!this.activeFilters.length) {
            this.activeFilters = [this.nav[0]];
          }
        }

        this.activeFilters.forEach(f => {
          filteredGatherData = filteredGatherData.filter(location => {
            return f.id !== 'f-2'
              ? (location.waves as any[]).find(f.query)
              : this.checkDistanceBetweenOriginAndLocation(location.visit_address.lat, location.visit_address.lng);
          });
        })
        filteredGatherData = [...new Set(filteredGatherData)];
        this.onGetMarkers(filteredGatherData);
      } else if (filter.id === 'f-1') {
        this.activeFilters = [this.nav[0]];
        this.onGetMarkers(this.data.filter((location: any) => (location.waves as any[]).find(filter.query)));
      }
    } else {
      this.onGetMarkers(this.data.filter((location: any) => location.visit_address && location.visit_address.name && location.visit_address.name.toLowerCase().includes(this.selected.toLowerCase())));
    }
    sessionStorage.setItem('filters', JSON.stringify(this.activeFilters.map(i => i.id)))
  }

  activeFilterCheck(filterId: string) {
    return this.activeFilters.find((f: any) => f.id === filterId);
  }

  goToLocation(event: any) {
    this.router.navigate([`/location/${event.item.post.name}`])
  }

  goToNearestLocation(location: string) {
    this.router.navigate(['/location', location])
    this.modalRef?.hide();
    sessionStorage.setItem('homeModalShown', 'true');
  }

  closeModal() {
    this.modalRef?.hide();
    sessionStorage.setItem('homeModalShown', 'true');
  }

  findClosestMarker() {
    this.getPosition().then(resp => {
      let nearestIndex = 1;
      let tempDist = 25000;
      const fromLng = +resp.lng;
      const fromLat = +resp.lat;

      this.markers.forEach((marker, i) => {
        if (marker.status === 'opened') {
          const dist = this.calculateDistance({lat: fromLat, lng: fromLng},{lat: +marker.position.lat, lng: +marker.position.lng});
          if (dist < tempDist) {
            tempDist = dist;
            nearestIndex = i;
          }
        }
      })
      this.nearestLocation = this.markers[nearestIndex];
      this.modalRef = this.modalService.show(this.bookingModal, {class: 'modal-md modal-dialog-centered'});
      this.isLoading = false;
    })
      .catch(err => {
        console.log(err)
        this.isLoading = false;
      })
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      }, err => {
        reject(err);
      });
    });
  }

  checkDistanceBetweenOriginAndLocation(lat: string, lng: string) {
    let locPos = {lat, lng};

    return this.calculateDistance(this.center, locPos) <= 622;
  }

  calculateDistance(mk1: any, mk2: any) {
    const R = 3958.8;
    const rlat1 = mk1.lat * (Math.PI/180);
    const rlat2 = mk2.lat * (Math.PI/180);
    const difflat = rlat2-rlat1;
    const difflon = (mk2.lng-mk1.lng) * (Math.PI/180);

    return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  }

  isOpenedLocation(date: string): boolean {
    const toFormat = date.slice(0,4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    return new Date(toFormat) < new Date();
  }
}
