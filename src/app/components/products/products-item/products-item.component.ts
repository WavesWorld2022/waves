import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";
import {IManufacturer, IWaveProductionMethod, IWaveSystemProduct} from "../../../shared/models";

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss']
})
export class ProductsItemComponent implements OnInit {
  product!: IWaveSystemProduct;
  isLoading = true;

  constructor(
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
  }

  ngOnInit() {
    this.fireService.onGetCollection('products');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.product = resp.find((l: IWaveSystemProduct) => l.waveSystemProductKey.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }

  goTo(type: string, id: string) {
    this.fireService.onGetCollection(type === 'manufactures' ? 'manufacturer' : 'production-methods');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.router.navigate([`/${type}/${type === 'technologies' ? resp.find((l: IWaveProductionMethod) => l.waveProductionMethodKey == id).waveProductionMethodKey : resp.find((l: IManufacturer) => l.manufacturerKey == id).manufacturerKey}`])
    })
  }
}
