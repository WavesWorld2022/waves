import { Component, OnInit } from '@angular/core';
import {FireService} from "../../services/fire.service";
import {IProduct, IWaveSystemProduct} from "../../shared/models";
import {take, takeUntil} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  isLoading = false;
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
  products: IWaveSystemProduct[] = [];

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
    this.fireService.onGetCollection('products');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: IProduct[]) => {
      resp.sort((a: any, b: any) => (a.waveSystemProductName > b.waveSystemProductName) ? 1 : ((b.waveSystemProductName > a.waveSystemProductName) ? -1 : 0))
        .forEach((m: any) => {
          this.products.push(m);
        })
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }
}
