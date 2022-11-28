import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {locations} from "../../../assets/json/locations";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  location: any;
  zoom = 12
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

  wave: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      //console.log(this.activatedRoute.snapshot.params['id'])
      this.location = locations.find(l => l.post && l.post.name === this.activatedRoute.snapshot.params['id'])
      console.log(this.location)
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
        /*options: {
          animation: google.maps.Animation.DROP,
          icon: '../assets/iconsInUse/location_1.png'
        }*/
      }
      this.wave = this.location.waves[0];
      console.log(this.wave)
    });
  }
}
