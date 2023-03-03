import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {DomSanitizer} from '@angular/platform-browser';
import {MapInfoWindow} from "@angular/google-maps";
import {WeatherService} from "../../services/weather.service";
import {SlickCarouselComponent} from "ngx-slick-carousel";
import {FireService} from "../../services/fire.service";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild('slickModal', {static: false}) slickModal!: SlickCarouselComponent;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;
  location: any;
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

  wave: any;
  selectedWave!: string;

  infoContent: any;

  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1};
  isPhoneScreen!: boolean;

  constructor(
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private weatherService: WeatherService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fireService.onGetCollection('locations').subscribe(resp => {
        this.location = resp.find((l:any) => l.post && l.post.name === this.activatedRoute.snapshot.params['id']);
        if(!this.location) {
          this.router.navigate(['../../home'])
        } else {
          this.coords = {
            lat: +this.location.visit_address.lat,
            lng: +this.location.visit_address.lng,
          }
          this.calculateWaterTemp(this.coords.lat, this.coords.lng);
          this.marker = {
            position: {
              lat: +this.location.visit_address.lat,
              lng: +this.location.visit_address.lng,
            },
            title: this.location.post.title,
            direction: ''
            /*options: {
              animation: google.maps.Animation.DROP,
              icon: '../assets/iconsInUse/location_1.png'
            }*/
          }

          this.location.nearby_natural_spots.forEach((spot: any) => {
            const destination = spot.address.address && spot.address.lat && spot.address.lng ? spot.address.lat + ',' + spot.address.lng : '';
            const origin = this.location.visit_address.address && this.location.visit_address.lat && this.location.visit_address.lng
              ? this.location.visit_address.lat + ',' + this.location.visit_address.lng
              : '';

            let marker = {
              position: {
                lat: +spot.address.lat,
                lng: +spot.address.lng
              },
              title: spot.name,
              address: spot.address.address,
              direction: 'https://www.google.com/maps/dir/?api=1&origin='+ origin +'&destination='+ destination +'&travelmode=driving',
            }
            this.naturalSpotsMarkers.push(marker);
          })
          this.wave = this.location.waves[0];
          this.selectedWave = this.location.waves[0].wave_name;
        }
      })
    });
    innerWidth >= 768 ? this.isPhoneScreen = false : this.isPhoneScreen = true;
  }

  isPricing(wave: any) {
    return +wave.price_adult_high || +wave.price_adult_low || +wave.price_child_high || +wave.price_child_low;
  }

  onSelectWave(value: any) {
    this.wave = this.location.waves.find((wave: any) => wave.wave_name === value);
    // @ts-ignore
    document.querySelector(".text-box").value = value;
  }

  getDate(date: string) {
    return new Date(date.slice(0, 4) + '.' + date.slice(4, 6) + '.' + date.slice(6)).toDateString().slice(3);
  }

  openInfo(spot: any, content: any) {
    this.infoContent = content;
    this.info.open(spot);
  }

  calculateWaterTemp(lat: any, lng: any) {
    this.weatherService.getWeatherData(lat, lng).subscribe(data => {
      const actualWaterTemp = Math.round(data.main.temp - 3);
      const recommendedWetsuit = '';

      this.location.waves.forEach((wave: any, i: number) => {
        if (wave.wave_system === 'river') {
          //not indoor
          this.location.waves[i].water_temp = actualWaterTemp;

          if (actualWaterTemp <= 3) {
            this.location.waves[i].recommended_wetsuite = ['6/5mm to 7mm thickness wetsuit'];
          } else if (actualWaterTemp >= 4 && actualWaterTemp <= 7) {
            this.location.waves[i].recommended_wetsuite = ['5/4mm to 6/5mm thickness wetsuit'];
          } else if (actualWaterTemp >= 8 && actualWaterTemp <= 11) {
            this.location.waves[i].recommended_wetsuite = ['4/3mm to 5/4mm thickness wetsuit'];
          } else if (actualWaterTemp >= 12 && actualWaterTemp <= 17) {
            this.location.waves[i].recommended_wetsuite = ['3/2mm to 4/3mm thickness wetsuit'];
          } else if (actualWaterTemp >= 18 && actualWaterTemp <= 20) {
            this.location.waves[i].recommended_wetsuite = ['wetsuit 2mm'];
          } else if (actualWaterTemp >= 21 && actualWaterTemp <= 25) {
            this.location.waves[i].recommended_wetsuite = ['wetsuit 1mm'];
          } else if (actualWaterTemp >= 26) {
            this.location.waves[i].recommended_wetsuite = ['wetsuit with UV protection of Lycra (UV Lycra)'];
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
