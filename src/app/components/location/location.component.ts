import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Subject, takeUntil} from "rxjs";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {DomSanitizer} from '@angular/platform-browser';
import {MapInfoWindow} from "@angular/google-maps";
import {WeatherService} from "../../services/weather.service";
import {SlickCarouselComponent} from "ngx-slick-carousel";
import {FireService} from "../../services/fire.service";
import {
  IManufacturer,
  INearbyNaturalSpot,
  IWaveLocation,
  IWaveProductionMethod,
  IWaveSpecification,
  IWaveSystemProduct
} from "../../shared/models";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnDestroy {
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild('slickModal', {static: false}) slickModal!: SlickCarouselComponent;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;
  location!: IWaveLocation;
  zoom = 12;
  nearbySpotsZoom = 10;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    gestureHandling: 'cooperative',
    disableDoubleClickZoom: true,
    maxZoom: 100,
    minZoom: 1,
    styles: GoogleMapConfig.styles
  }
  coords: any;
  marker: any;
  naturalSpotsMarkers: any[] = [];

  locationSpecifications!: IWaveSpecification[];
  nearbyNaturalSpots!: INearbyNaturalSpot[];
  wave: any;
  selectedWave!: string;
  supportedCollections: any[] = [];

  infoContent: any;
  specificationInfo: any;

  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1};
  isPhoneScreen!: boolean;
  currentSpecificationIndex = 0;
  destroyer$ = new Subject();

  constructor(
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private weatherService: WeatherService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.fireService.onGetCollection('locations');
      this.fireService.collectionData$.pipe(takeUntil(this.destroyer$)).subscribe((resp: IWaveLocation[]) => {
        console.log(resp)
        this.location = resp.find((l:any) => l && l.waveLocationKey === this.activatedRoute.snapshot.params['id'])!;
        if(!this.location) {
          this.router.navigate(['../../home'])
        } else {
          this.coords = {
            lat: +this.location.waveLocationVisitAddress.lat,
            lng: +this.location.waveLocationVisitAddress.lng,
          }
          this.marker = {
            position: {
              lat: +this.location.waveLocationVisitAddress.lat,
              lng: +this.location.waveLocationVisitAddress.lng,
            },
            title: this.location.waveLocationName,
            direction: ''
            /*options: {
              animation: google.maps.Animation.DROP,
              icon: '../assets/iconsInUse/location_1.png'
            }*/
          }
          // nearby locations
          this.fireService.onGetSecondCollection('nearby-natural-spots');
          this.fireService.collectionSecondData$.pipe(takeUntil(this.destroyer$)).subscribe((resp: INearbyNaturalSpot[]) => {
            this.nearbyNaturalSpots = resp.filter((spot: INearbyNaturalSpot) => spot.nearbyNaturalSpotLocation === this.activatedRoute.snapshot.params['id']);
            this.nearbyNaturalSpots.forEach((spot: INearbyNaturalSpot) => {
              const destination = spot.nearbyNaturalSpotAddress.address && spot.nearbyNaturalSpotAddress.lat && spot.nearbyNaturalSpotAddress.lng ? spot.nearbyNaturalSpotAddress.lat + ',' + spot.nearbyNaturalSpotAddress.lng : '';
              const origin = this.location.waveLocationVisitAddress.address && this.location.waveLocationVisitAddress.lat && this.location.waveLocationVisitAddress.lng
                  ? this.location.waveLocationVisitAddress.lat + ',' + this.location.waveLocationVisitAddress.lng
                  : '';

              let marker = {
                position: {
                  lat: +spot.nearbyNaturalSpotAddress.lat,
                  lng: +spot.nearbyNaturalSpotAddress.lng
                },
                title: spot.nearbyNaturalSpotName,
                address: spot.nearbyNaturalSpotAddress.address,
                direction: 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=driving',
              }
              this.naturalSpotsMarkers.push(marker);
            })
          })

          this.fireService.onGetThirdCollection('specifications');
          this.fireService.collectionThirdData$.pipe(takeUntil(this.destroyer$)).subscribe((resp: IWaveSpecification[]) => {
            console.log(resp)
            this.locationSpecifications = resp
                .filter(spec => spec.waveSpecificationLocation === this.activatedRoute.snapshot.params['id']);
            this.wave = this.locationSpecifications[0];
            this.selectedWave = this.locationSpecifications[0].waveSpecificationName;

            console.log(this.locationSpecifications)
            this.specificationInfo = this.getSpecificationInfo(this.locationSpecifications[this.currentSpecificationIndex].waveSpecificationProduct!);
            this.calculateWaterTemp(this.coords.lat, this.coords.lng);
          })
        }
      })

      this.fireService.getSupportCollections(['products', 'production-methods', 'manufacturer'])
          .pipe(takeUntil(this.destroyer$))
          .subscribe(resp => {
        resp.forEach((snapshot: any) => {
          if (snapshot.val()) {
            this.supportedCollections.push(snapshot.val())
          }
        })
      })
    });
    innerWidth >= 768 ? this.isPhoneScreen = false : this.isPhoneScreen = true;
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  isPricing(wave: any) {
    return +wave.waveSpecificationPriceAdultHigh
        || +wave.waveSpecificationPriceAdultLow
        || +wave.waveSpecificationPriceChildHigh
        || +wave.waveSpecificationPriceChildLow;
  }

  getSpecificationInfo(productKey: string) {
    const productData = this.supportedCollections[0].find((item: IWaveSystemProduct) => item.waveSystemProductKey === productKey)!;
    const prodMethodData = this.supportedCollections[1].find((item: IWaveProductionMethod) => item.waveProductionMethodKey === productData?.waveSystemProductProductionMethod)!;
    const manufacturerData = this.supportedCollections[2].find((item: IManufacturer) => item.manufacturerKey === productData?.waveSystemProductManufacturer)!;

    return {
      product: {
        name: productData?.waveSystemProductName,
        path: productData?.waveSystemProductKey,
      },
      productionMethod: {
        name: prodMethodData?.waveProductionMethodName,
        path: prodMethodData?.waveProductionMethodKey
      },
      manufacturer: {
        name: manufacturerData?.manufacturerName,
        path: manufacturerData?.manufacturerKey
      }
    }
  }

  getCurrentSlide(event: any) {
    this.currentSpecificationIndex = event.currentSlide;
    this.specificationInfo = this.getSpecificationInfo(this.locationSpecifications[this.currentSpecificationIndex].waveSpecificationProduct!);
  }

  /*onSelectWave(value: any) {
    this.wave = this.location.waves.find((wave: any) => wave.wave_name === value);
    // @ts-ignore
    document.querySelector(".text-box").value = value;
  }*/

  getDate(date: string) {
    return new Date(date.slice(4, 6) + '/' +  + date.slice(6) + '/' + date.slice(0, 4)).toDateString().slice(3);
    //return new Date(date.slice(0, 4) + '.' + date.slice(4, 6) + '.' + date.slice(6)).toDateString().slice(3);
  }

  openInfo(spot: any, content: any) {
    this.infoContent = content;
    this.info.open(spot);
  }

  calculateWaterTemp(lat: any, lng: any) {
    this.weatherService.getWeatherData(lat, lng).pipe(takeUntil(this.destroyer$)).subscribe(data => {
      const actualWaterTemp = Math.round(data.main.temp - 3);

      this.locationSpecifications.forEach((wave: any, i: number) => {
        if (!wave.waveSpecificationIndoor) {
          this.locationSpecifications[i].waveSpecificationWaterTemp = actualWaterTemp;

          if (actualWaterTemp <= 3) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['6/5mm to 7mm thickness wetsuit'];
          } else if (actualWaterTemp >= 4 && actualWaterTemp <= 7) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['5/4mm to 6/5mm thickness wetsuit'];
          } else if (actualWaterTemp >= 8 && actualWaterTemp <= 11) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['4/3mm to 5/4mm thickness wetsuit'];
          } else if (actualWaterTemp >= 12 && actualWaterTemp <= 17) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['3/2mm to 4/3mm thickness wetsuit'];
          } else if (actualWaterTemp >= 18 && actualWaterTemp <= 20) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['wetsuit 2mm'];
          } else if (actualWaterTemp >= 21 && actualWaterTemp <= 25) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['wetsuit 1mm'];
          } else if (actualWaterTemp >= 26) {
            this.locationSpecifications[i].waveSpecificationRecommendedWetSuite = ['wetsuit with UV protection of Lycra (UV Lycra)'];
          }
        }
      })
    })
  }

  replaceURLs(message: any) {
    if(!message) return;

    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, (url: any) => {
      let hyperlink = url;
      if (!hyperlink.match('^https?:\/\/')) {
        hyperlink = 'http://' + hyperlink;
      }
      if(hyperlink.includes('youtube.com') || hyperlink.includes('youtu.be')) {
        let you = 'https://www.youtube.com/embed/' + hyperlink.replace(hyperlink.includes('youtube.com') ? 'https://youtube.com/' : 'https://youtu.be/', '')
        return '<div class="youtube"><iframe width="100%" height="400" src="' + you + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
      } else if(hyperlink.includes('vimeo.com')) {
        let vim = 'https://player.vimeo.com/video/' + hyperlink.replace('https://vimeo.com/', '')
        return '<div class="youtube"><iframe src="' + vim + '" width="100%" height="500" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
      } else {
        return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
      }
    }).replace(/Source:/gi, '<br><strong>Source:</strong>');
  }

  onDropdown() {
    this.dropdownToggle.nativeElement.classList.toggle("active")
  }

  next() {
    this.slickModal.slickNext();
  }

  prev() {
    console.log(this.slickModal)
    this.slickModal.slickPrev();
  }
}
