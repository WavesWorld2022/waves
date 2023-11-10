import {Component, OnInit} from '@angular/core';
import {FireService} from "../../services/fire.service";
import {IManufacturer, IWaveProductionMethod} from "../../shared/models";
import {take} from "rxjs";

@Component({
  selector: 'app-manufactures',
  templateUrl: './manufactures.component.html',
  styleUrls: ['./manufactures.component.scss']
})
export class ManufacturesComponent implements OnInit {
  isLoading = false;
  activeFilter = 'f-1';
  lastUpdated = '';

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
  manufacturers: IManufacturer[] = [];

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
    this.fireService.onGetCollection('manufacturer');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: IManufacturer[]) => {
      resp.sort((a: any, b: any) => (a.manufacturerName > b.manufacturerName) ? 1 : ((b.manufacturerName > a.manufacturerName) ? -1 : 0))
          .forEach((m: any) => {
            this.manufacturers.push(m);
          })
      this.lastUpdated = this.getLastUpdated(this.manufacturers);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }

  getLastUpdated(data: IManufacturer[]) {
    let lastUpdatedDate = data[0].manufacturerLastUpdated;
    const methods = data.map(item => item.manufacturerLastUpdated).filter(item => !!item);
    methods.forEach((date: any) => {
      // @ts-ignore
      if (new Date(date) > new Date(lastUpdatedDate)) {
        lastUpdatedDate = date;
      }
    });

    return lastUpdatedDate!.split(' ')[0].split('-').reverse().join('.');
  }
}
