import {AfterViewInit, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NavigationService} from "../../services/navigation.service";
import {FireService} from "../../services/fire.service";
import {locations} from "../../../assets/json/old/locations";
import {Subject, take, takeUntil} from "rxjs";
import {IWaveLocation, IWaveProductionMethod, IWaveSpecification, IWaveSystemProduct} from "../../shared/models";
import {DOCUMENT} from "@angular/common";
import {products} from "../../../assets/json/products";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef?: BsModalRef;
  data: IWaveLocation[] = [];
  selected = '';
  isLoading = false;
  isMenuOpen = false;
  //activeFilter = 'f-1';

  nav = [
    {titleH: "World Map", id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: IWaveSpecification) => w},
    {titleH: "Near-me", id: 'f-2',  title: '',  icon: 'shield-1-2', query: (w: IWaveSpecification) => w},
    {titleH: "Rolling", id: 'f-3',  title: '~',   icon: 'shield-2', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) !== 'Standing' && this.onGetProductionMethodType(w.waveSpecificationProduct) !== 'River'},
    {titleH: "Standing", id: 'f-4',  title: 'S',   icon: 'shield-3', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) === 'Standing'},
    {titleH: "River", id: 'f-5',  title: 'R',   icon: 'shield-4', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) === 'River'},
    {titleH: "Indoor", id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationIndoor},
    {titleH: "Open", id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: IWaveSpecification) => w.waveSpecificationStatus !== 'permanently closed' && this.isOpenedLocation(w.waveSpecificationCommissioningDate) || (w.waveSpecificationStatus === 'open only summer season' && this.isSummer)},
    {titleH: "Planned", id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: IWaveSpecification) => w.waveSpecificationStatus === 'planned' || !this.isOpenedLocation(w.waveSpecificationCommissioningDate)},
    {titleH: "Closed", id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationStatus === 'permanently closed' && this.isOpenedLocation(w.waveSpecificationCommissioningDate)},
    {titleH: "Kids", id: 'f-10', title: 'K',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationMinimumSurferAge && w.waveSpecificationMinimumSurferAge <= 8},
    {titleH: "Sustainable booking", id: 'f-11', title: '♕',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationAffiliate},
  ];

  @ViewChild('bookingModal', {static: true}) bookingModal!: TemplateRef<any>
  // @ts-ignore
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  // @ts-ignore
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
  infoContent: any;
  // @ts-ignore
  center: google.maps.LatLngLiteral;
  specifications: IWaveSpecification[] = [];
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
  lastUpdated?: string;

  browserRefresh?: boolean;

  products: IWaveSystemProduct[] = [];
  productionMethods: IWaveProductionMethod[] = [];

  destroyer$ = new Subject();

  constructor(
    private fireService: FireService,
    private router: Router,
    private modalService: BsModalService,
    private navService: NavigationService,
    @Inject(DOCUMENT) private document: Document
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
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    this.height = (window.visualViewport.height - (window.innerWidth < 980 ? 171 : 206)) + 'px';

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.fireService.onGetSecondCollection('specifications');
    this.fireService.collectionSecondData$.pipe(take(1)).subscribe((resp: IWaveSpecification[]) => {
      this.specifications = resp;

      this.fireService.onGetCollection('locations');
      this.fireService.collectionData$.pipe(take(1)).subscribe((resp: IWaveLocation[]) => {
        this.data.length = 0;
        this.data = resp.filter((location: IWaveLocation) => location && location.waveLocationName);
        this.lastUpdated = this.getLastUpdated(this.specifications, this.data);
        this.data.filter(s => s.waveLocationAffiliate).forEach(s => {
          this.specifications.filter(sp => sp.waveSpecificationLocation === s.waveLocationKey).forEach(z => {
            z.waveSpecificationAffiliate = true;
          })
        })

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

        if (sessionStorage.getItem('homeModalShown') === null) {
          this.findClosestMarker();
        } else {
          this.browserRefresh
              ? (setTimeout(() => {
                this.isLoading = false;
              }, 1000))
              : (this.isLoading = false);
        }
      });
    });
    this.fireService.onGetThirdCollection('products');
    this.fireService.onGetFourthCollection('production-methods');
    this.fireService.collectionThirdData$.pipe(takeUntil(this.destroyer$)).subscribe(res => {
      this.products = res;
    });
    this.fireService.collectionFourthData$.pipe(takeUntil(this.destroyer$)).subscribe(res => {
      this.productionMethods = res
    })
  }

  // pass waveSpecificationProduct
  onGetProductionMethodType(product: any) {
    const productItem = this.products.find(pr => pr.waveSystemProductKey === product);
    const waveProductionMethodType = this.productionMethods.find(pm => pm.waveProductionMethodKey === productItem?.waveSystemProductProductionMethod)?.waveProductionMethodType;
    return waveProductionMethodType ? waveProductionMethodType : '';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if(this.isMenuOpen) {
      this.document.body.classList.add('menu-open');
    } else {
      this.document.body.classList.remove('menu-open');
    }
  }

  onGetMarkers(arr: IWaveLocation[]) {
    this.markers.length = 0;
    arr.forEach((location: IWaveLocation) => {
      const specifications = this.specifications.filter((item: IWaveSpecification) => item.waveSpecificationLocation === location.waveLocationKey);
      const destination = location.waveLocationVisitAddress && location.waveLocationVisitAddress.lat && location.waveLocationVisitAddress.lng ? location.waveLocationVisitAddress.lat + ',' + location.waveLocationVisitAddress.lng : '';
      const origin = this.center && this.center.lat && this.center.lng ? this.center.lat + ',' + this.center.lng : '';
      this.markers.push(
        {
          position: {
            lat: Number(location.waveLocationVisitAddress.lat),
            lng: Number(location.waveLocationVisitAddress.lng),
          },
          id: location.waveLocationKey,
          direction: 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=driving',
          title: location.waveLocationName,
          name: location.waveLocationKey,
          reflink: location.waveLocationReferralLink,
          status: specifications[0].waveSpecificationStatus.toLowerCase().includes('open') ? 'opened' : 'closed',
          options: {
            zIndex: location.waveLocationAffiliate ? 99 : null,
            label: location.waveLocationAffiliate ? {className: 'affiliate-za', text: 'a'} : '',
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

  getLastUpdated(specifications: IWaveSpecification[], locations: IWaveLocation[]) {
    let lastUpdatedDate = specifications[0].waveSpecificationLastUpdated;
    const specificationDates = specifications.map(item => item.waveSpecificationLastUpdated).filter(item => !!item);
    const locationDates = locations.map(item => item.waveLocationLastUpdated).filter(item => !!item);
    specificationDates.concat(locationDates).forEach((date: any) => {
      // @ts-ignore
      if (new Date(date) > new Date(lastUpdatedDate)) {
        lastUpdatedDate = date;
      }
    });

    return lastUpdatedDate!.split(' ')[0].split('-').reverse().join('.');
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
    pos.lat = pos.lat + 20;

    this.map.googleMap?.panTo(pos);
  }

  onFilter(filter?: any) {
    let filteredGatherLocationsData: any[] = [...this.data];
    let filteredSpecifications = [...this.specifications];
    let locationKeyArray: string[] = [];
    let mixArrayOfSpec = [];

    if(filter) {
      if (filter.type === 'keyup') {
        this.onGetMarkers(this.data.filter((location: IWaveLocation) => location.waveLocationName.toLowerCase().includes(filter.target.value.toLowerCase())));
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

        if (this.activeFilters.length === 1) {
          if (this.activeFilters[0].id !== 'f-2') {
            filteredSpecifications = filteredSpecifications.filter(this.activeFilters[0].query);
          }

          locationKeyArray = [...new Set(filteredSpecifications.map(spec => spec.waveSpecificationLocation))];
          filteredGatherLocationsData = this.data.filter((loc: IWaveLocation) => locationKeyArray.includes(loc.waveLocationKey));

        } else if (this.activeFilters.length > 1) {
          for (let i = 0; i <= this.activeFilters.length - 1; i++) {
            const tempArr = [...this.specifications].filter(this.activeFilters[i].query);
            const tempArrLocationKeys = [...new Set(tempArr.map(s => s.waveSpecificationLocation))];
            mixArrayOfSpec.push(tempArrLocationKeys);
          }
          // @ts-ignore
          const filteredLocationsKeys = this.findAppropriateElement(mixArrayOfSpec);
          filteredGatherLocationsData = this.data.filter((loc: IWaveLocation) => filteredLocationsKeys.includes(loc.waveLocationKey));
        }

        if (this.activeFilters.find((f: any) => f.id === 'f-2')) {
          filteredGatherLocationsData = filteredGatherLocationsData.filter(location => this.checkDistanceBetweenOriginAndLocation(location.waveLocationVisitAddress.lat, location.waveLocationVisitAddress.lng));
        }

        this.onGetMarkers(filteredGatherLocationsData);

      } else if (filter.id === 'f-1') {
        this.activeFilters = [this.nav[0]];
        this.onGetMarkers(filteredGatherLocationsData);
      }
    } else {
      this.onGetMarkers(filteredGatherLocationsData);
    }
    sessionStorage.setItem('filters', JSON.stringify(this.activeFilters.map(i => i.id)))
  }

  findAppropriateElement(arrays: [][]) {
    let commonElements: any = [];

    let firstArray = arrays[0];

    for (let i = 0; i < firstArray.length; i++) {
      let currentObject = firstArray[i];
      let isCommon = true;

      for (let j = 1; j < arrays.length; j++) {
        let found = false;
        for (let k = 0; k < arrays[j].length; k++) {
          let innerObject = arrays[j][k];
          if (this.isObjectEqual(currentObject, innerObject)) {
            found = true;
            break;
          }
        }

        if (!found) {
          isCommon = false;
          break;
        }
      }

      if (isCommon) {
        commonElements.push(currentObject);
      }
    }

    return commonElements;
  }

  isObjectEqual(obj1: any, obj2: any) {
    return obj1 === obj2;
  }

  activeFilterCheck(filterId: string) {
    return this.activeFilters.find((f: any) => f.id === filterId);
  }

  goToLocation(event: any) {
    console.log(1)
    this.router.navigate([`/location/${event.item.waveLocationKey}`])
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
        console.log(resp)
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

  isOpenedLocation(date: string | number): boolean {
    if (typeof date === 'number') {
      date = date.toString();
    }
    const toFormat = date.slice(0,4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    return new Date(toFormat) < new Date();
  }
}
