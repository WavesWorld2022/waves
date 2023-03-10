import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss']
})
export class ProductsItemComponent implements OnInit {
  product: any;
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
      this.product = resp.find((l: any) => l.link.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }

  goTo(type: string, id: string) {
    this.fireService.onGetCollection(type === 'manufactures' ? 'manufacturer' : 'technologies');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.router.navigate([`/${type}/${type === 'manufactures' ? resp.find((l: any) => l.id == id).link : resp.find((l: any) => l.id == id).permalink}`])
    })
  }
}
