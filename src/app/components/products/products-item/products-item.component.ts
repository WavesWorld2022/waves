import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {products} from "../../../../assets/json/products";
import {StringParserService} from "../../../services/string-parser.service";

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss']
})
export class ProductsItemComponent implements OnInit {
  product: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.product = products.find(l => l.link.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
    });
  }

  ngOnInit(): void {
  }

}
