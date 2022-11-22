import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {waveLocations} from "../../../assets/json/markers";
import {GoogleMapConfig} from "../../../assets/json/google-map.config";
import {posts} from "../../../assets/json/post";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isLoading = true;
  activeFilter = 'f-1';

  nav = [
    {id: 'f-1', title: 'All', icon: 'shield-0'},
    {id: 'f-2', title: 'ME', icon: 'shield-1'},
    {id: 'f-3', title: 'R', icon: 'shield-2'},
    {id: 'f-4', title: 'S', icon: 'shield-3'},
    {id: 'f-5', title: 'R', icon: 'shield-4'},
    {id: 'f-6', title: 'TT', icon: 'shield-0'},
    {id: 'f-7', title: '[-', icon: 'shield-5'},
    {id: 'f-8', title: '[', icon: 'shield-6'},
    {id: 'f-9', title: '[-]', icon: 'shield-0'},
    {id: 'f-10', title: '<8', icon: 'shield-0'}
  ];
  // @ts-ignore
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  // @ts-ignore
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
  infoContent: any;
  // @ts-ignore
  center: google.maps.LatLngLiteral;
  markers: any[] = [];
  height: string | number = 500;
  zoom = 2;
  // @ts-ignore
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'terrain',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 500,
    minZoom: 0,
    styles: GoogleMapConfig.styles
  };
  constructor() { }

  ngOnInit() {
    this.onGetMarkers();
    // @ts-ignore
    this.height = (window.innerHeight - 206) + 'px';
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onGetMarkers() {
    // console.log(posts.length)
    // console.log(waveLocations.length)
    waveLocations.forEach(location => {
      this.markers.push(
        {
          position: {
            lat: location.lat,
            lng: location.lng,
          },
          label: null,
          info: "",
          title: '',
          options: {},
        }
      )
    })
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.map.googleMap.setOptions({styles: this.options.styles});
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
  }
}
