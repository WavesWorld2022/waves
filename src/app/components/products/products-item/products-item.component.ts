import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss']
})
export class ProductsItemComponent {
  product: any;
  isLoading = true;

  constructor(
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fireService.onGetCollection('products').subscribe((resp: any) => {
        this.product = resp.find((l: any) => l.link.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      })
    });
  }

  goTo(type: string, id: string) {
    this.fireService.onGetCollection(type === 'manufactures' ? 'manufacturer' : 'technologies').subscribe((resp: any) => {
      this.router.navigate([`/${type}/${type === 'manufactures' ? resp.find((l: any) => l.id == id).link : resp.find((l: any) => l.id == id).permalink}`])
    })
  }
}
