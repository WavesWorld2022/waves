import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, Subject, take, takeUntil} from "rxjs";
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
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss']
})
export class ProductsItemComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  infoContent: any;
  product!: IWaveSystemProduct;
  isLoading = true;
  isTablet = window.innerWidth <= 768;

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
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
  }

  ngOnInit() {
    this.height = (window.visualViewport.height - (window.innerWidth < 980 ? 171 : 206)) + 'px';

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.fireService.onGetCollection('products');
    this.fireService.onGetSecondCollection('specifications');
    this.fireService.onGetThirdCollection('locations');

    const p = this.fireService.collectionData$;
    const s = this.fireService.collectionSecondData$;
    const l = this.fireService.collectionThirdData$;

    combineLatest([p, s, l]).pipe(takeUntil(this.destroy$)).subscribe(
        (resp) => {
          this.product = resp[0].find((l: IWaveSystemProduct) => l.waveSystemProductKey.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
          this.products = resp[0];
          this.specifications = resp[1];
          this.locations = resp[2];

          this.onFilterByProduct();
          this.isLoading = false;
        });

    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.product = resp.find((l: IWaveSystemProduct) => l.waveSystemProductKey.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
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

  onFilterByProduct() {
    let fitSpecifications: IWaveSpecification[] = [];
    let locationKeysArray: string[] = [];
    let filteredLocations;
    const fitProducts = this.products.filter(p => p.waveSystemProductKey === this.product.waveSystemProductKey);

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

  goTo(type: string, id: string) {
    this.fireService.onGetCollection(type === 'manufactures' ? 'manufacturer' : 'production-methods');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.router.navigate([`/${type}/${type === 'technologies' ? resp.find((l: IWaveProductionMethod) => l.waveProductionMethodKey == id).waveProductionMethodKey : resp.find((l: IManufacturer) => l.manufacturerKey == id).manufacturerKey}`])
    })
  }
}
