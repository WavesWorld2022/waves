import { Component, OnInit } from '@angular/core';
import {locations} from "../../../assets/json/locations";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  isLoading = false;
  selected = '';
  activeFilter = 'f-1';

  nav = [
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
  ];
  waveLocations: any[] = [];
  filteredLocations: any[] = [];

  constructor() { }

  get isSummer(): boolean {
    const month = new Date().getMonth() + 1;
    return month > 6 && month < 9
  }

  ngOnInit(): void {
    locations
      .filter((l: any) => l.post && l.post.title && !(isNaN(Number(this.getPPMSonBoard(l))) || Number(this.getPPMSonBoard(l)) === 0))
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
  }

  getPPMSonBoard(item: any) {
    const price = item['waves'] && item['waves'][0] && ['price_adult_high'] ? item['waves'][0]['price_adult_high'] : 0;
    const waves = item['waves'] && item['waves'][0] && ['waves_per_hour'] ? item['waves'][0]['waves_per_hour'] : 0;
    const duration = item['waves'] && item['waves'][0] && ['ride_duration'] ? item['waves'][0]['ride_duration'] : 0;
    const PPMSonBoard = Number(price)/(Number(waves)*Number(duration));
    return (isNaN(PPMSonBoard) || PPMSonBoard === 0) ? '-' : (PPMSonBoard / 60).toFixed(2)
  }

  // PPMSonBoard = price_adult_high / (waves_per_hour x ride_duration)

  onFilter(filter?: any) {
    this.filteredLocations.length = 0;

    if(filter) {
      this.activeFilter = filter.id;
      this.filteredLocations = [...this.waveLocations.filter(location => (location.waves as any[]).find(filter.query))];
    } else {
      this.activeFilter = 'f-1';
      this.filteredLocations = [this.filteredLocations.filter(location => location.visit_address && location.visit_address.name && location.visit_address.name.toLowerCase().includes(this.selected.toLowerCase()))];
    }
  }

}

