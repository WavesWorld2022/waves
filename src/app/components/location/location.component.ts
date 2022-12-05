import {Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {locations} from "../../../assets/json/locations";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {DomSanitizer} from '@angular/platform-browser';
import {MapInfoWindow} from "@angular/google-maps";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      //console.log(this.activatedRoute.snapshot.params['id'])
      this.location = locations.find(l => l.post && l.post.name === this.activatedRoute.snapshot.params['id']);
      if(!this.location) {
        this.router.navigate(['../../home'])
      } else {
        this.coords = {
          lat: +this.location.visit_address.lat,
          lng: +this.location.visit_address.lng,
        }
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
    });
  }

  isPricing(wave: any) {
    return +wave.price_adult_high || +wave.price_adult_low || +wave.price_child_high || +wave.price_child_low;
  }

  onSelectWave(event: any) {
    this.wave = this.location.waves.find((wave: any) => wave.wave_name === event);
  }

  getDate(date: string) {
    return new Date(date.slice(0, 4) + '.' + date.slice(4, 6) + '.' + date.slice(6)).toDateString().slice(3);
  }

  openInfo(spot: any, content: any) {
    this.infoContent = content;
    this.info.open(spot);
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
}
