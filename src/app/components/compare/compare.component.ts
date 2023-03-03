import { Component, OnInit } from '@angular/core';
import {FireService} from "../../services/fire.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  isLoading = false;
  selected = '';
  activeFilter = 'f-1';
  center: any;

  /*nav = [
    {id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: any) => w},
    {id: 'f-2',  title: 'ME',  icon: 'shield-1', query: (w: any) => w},
    {id: 'f-3',  title: 'R',   icon: 'shield-2', query: (w: any) => w.wave_system !== 'standing-wave' && w.wave_system !== 'river'},
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
    {id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: any) => w.wave_system !== 'river'},
    {id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: any) => w.status !== 'permanently closed' && this.isOpenedLocation(w.commissioning_date) || (w.status === 'open only summer season' && this.isSummer)},
    {id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: any) => w.status === 'planned' || !this.isOpenedLocation(w.waves.commissioning_date)},
    {id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: any) => w.status === 'permanently closed' && this.isOpenedLocation(w.commissioning_date)},
    {id: 'f-10', title: 'K',  icon: 'shield-0', query: (w: any) => w.minimum_age < 8}
  ];
  waveLocations: any[] = [];
  filteredLocations: any[] = [];
  activeFilters: any[] = [];

  constructor(private fireService: FireService) { }

  get isSummer(): boolean {
    const month = new Date().getMonth() + 1;
    return month > 6 && month < 9
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.fireService.onGetCollection('locations').subscribe((resp: any) => {
      resp.filter((l: any) => l.post && l.post.title && !(isNaN(Number(this.getPPMSonBoard(l))) || Number(this.getPPMSonBoard(l)) === 0))
        // @ts-ignore
        .sort((a,b) => (this.getPPMSonBoard(a) > this.getPPMSonBoard(b)) ? 1 : ((this.getPPMSonBoard(b) > this.getPPMSonBoard(a)) ? -1 : 0))
        .reverse()
        .forEach((m: any) => {
          this.waveLocations.push(m);
        })
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
      this.onFilter(this.nav[0]);
    });
  }

  getPPMSonBoard(item: any) {
    //console.log(item)
    const price = item['waves'] && item['waves'][0] && ['price_adult_high'] ? item['waves'][0]['price_adult_high'] : 0;
    const waves = item['waves'] && item['waves'][0] && ['waves_per_hour'] ? item['waves'][0]['waves_per_hour'] : 0;
    const duration = item['waves'] && item['waves'][0] && ['ride_duration'] ? item['waves'][0]['ride_duration'] : 0;
    const PPMSonBoard = (Number(price)/(Number(waves)*Number(duration))) * 60;
    /*return (isNaN(PPMSonBoard) || PPMSonBoard === 0) ? '-' : (PPMSonBoard / 60).toFixed(2)*/
    return (isNaN(PPMSonBoard) || PPMSonBoard === 0) ? '-' : Math.round(PPMSonBoard * 100) / 100;
  }

  // PPMSonBoard = price_adult_high / (waves_per_hour x ride_duration)

  onFilter(filter?: any) {
    this.filteredLocations.length = 0;
    let filteredGatherData = [...this.waveLocations];

    if(filter) {
       if (filter.id !== 'f-1') {
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
        this.filteredLocations = filteredGatherData;
      } else if (filter.id === 'f-1') {

        this.activeFilters = [this.nav[0]];
        this.filteredLocations = filteredGatherData;
      }

    } else {
      this.activeFilter = 'f-1';
      this.filteredLocations = [this.filteredLocations.filter(location => location.visit_address && location.visit_address.name && location.visit_address.name.toLowerCase().includes(this.selected.toLowerCase()))];
    }
  }

  isOpenedLocation(date: string): boolean {
    const toFormat = date.slice(0,4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    return new Date(toFormat) < new Date();
  }

  activeFilterCheck(filterId: string) {
    return this.activeFilters.find((f: any) => f.id === filterId);
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
}

