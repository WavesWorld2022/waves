import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, Subject, takeUntil} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";
import {
  IManufacturer,
  IWaveLocation,
  IWaveProductionMethod,
  IWaveSpecification,
  IWaveSystemProduct
} from "../../../shared/models";
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import {GoogleMapConfig} from "../../../../assets/json/google-map.config";

@Component({
  selector: 'app-technologies-item',
  templateUrl: './technologies-item.component.html',
  styleUrls: ['./technologies-item.component.scss']
})
export class TechnologiesItemComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  infoContent: any;
  isLoading = true;
  isTablet = window.innerWidth <= 768;
  technology!: IWaveProductionMethod;

  isMap = false;
  zoom = 2;
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
  height: string | number = 500;
  center!: google.maps.LatLngLiteral;
  markers: any[] = [];
  specifications: IWaveSpecification[] = [];
  locations: IWaveLocation[] = [];
  products: IWaveSystemProduct[] = [];
  technologies: IWaveProductionMethod[] = [];
  manufacturers: IManufacturer[] = [];

  destroy$ = new Subject<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService,
    private fireService: FireService
  ) {
  }

  ngOnInit(): void {
    this.height = (window.visualViewport.height - (window.innerWidth < 980 ? 171 : 206)) + 'px';

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.fireService.onGetCollection('production-methods');
    this.fireService.onGetSecondCollection('specifications');
    this.fireService.onGetThirdCollection('products');
    this.fireService.onGetFourthCollection('locations');

    const pm = this.fireService.collectionData$;
    const s = this.fireService.collectionSecondData$;
    const p = this.fireService.collectionThirdData$;
    const l = this.fireService.collectionFourthData$;

    combineLatest([pm, s, p, l]).pipe(takeUntil(this.destroy$)).subscribe(
        (resp) => {
          this.technology = resp[0].find((l: IWaveProductionMethod) => l.waveProductionMethodKey.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
          this.specifications = resp[1];
          this.products = resp[2];
          this.locations = resp[3];

          this.onFilterByProductionMethod();
          this.isLoading = false;
        });
  }


  ngAfterViewInit() {
    if(this.map) {
      this.map.googleMap?.setOptions({styles: this.options.styles});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onFilterByProductionMethod() {
    let fitSpecifications: IWaveSpecification[] = [];
    let locationKeysArray: string[] = [];
    let filteredLocations;
    const fitProducts = this.products.filter(p => p.waveSystemProductProductionMethod === this.technology.waveProductionMethodKey);

    fitProducts.forEach((prod: IWaveSystemProduct) => {
      const tempSpecs = this.specifications.filter((spec: IWaveSpecification) => {
        return spec.waveSpecificationProduct === prod.waveSystemProductKey
      });
      fitSpecifications = fitSpecifications.concat(tempSpecs);
    });
    locationKeysArray = Array.from(new Set(fitSpecifications.map(s => s.waveSpecificationLocation)));

    filteredLocations = this.locations.filter(item => locationKeysArray.includes(item.waveLocationKey));

    this.onGetMarkers(filteredLocations);
  }

  onGetMarkers(arr: IWaveLocation[]) {
    this.markers.length = 0;

    arr.forEach((location: IWaveLocation) => {
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
            options: {
              icon: '../assets/icons/multiple-filter.png'
            },
          }
      )
    })
  }

  zoomIn() {
    // @ts-ignore
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }
  zoomOut() {
    // @ts-ignore
    if (this.zoom > this.options.minZoom) this.zoom--;
  }

  openInfo(marker: any, content: any) {
    this.infoContent = content;
    this.info.open(marker);

    let pos = marker._position;
    pos.lat = pos.lat + 20;

    this.map.googleMap?.panTo(pos);
  }

  onToggleLayout() {
    this.isMap = !this.isMap;
  }

}
