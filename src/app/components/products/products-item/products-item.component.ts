import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {products} from "../../../../assets/json/products";
import {manufacturer} from "../../../../assets/json/manufacturer";
import {StringParserService} from "../../../services/string-parser.service";
import {technologies} from "../../../../assets/json/technologies";

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
    console.log(location.origin)
  }

  goTo(type: string, id: string) {
    let goToUrl;

    type === 'manufactures'
      // @ts-ignore
      ? goToUrl = `/${type}/${manufacturer.find(item => item.id === +id).link}`
      // @ts-ignore
      : goToUrl = `/${type}/${technologies.find((item: any) => item.id === +id).permalink}`

    this.router.navigate([goToUrl])
  }
}
