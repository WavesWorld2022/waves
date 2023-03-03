import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";

@Component({
  selector: 'app-manufactures-item',
  templateUrl: './manufactures-item.component.html',
  styleUrls: ['./manufactures-item.component.scss']
})
export class ManufacturesItemComponent {
  manufacturer: any;
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
      this.fireService.onGetCollection('manufacturer').subscribe((resp: any) => {
        this.manufacturer = resp.find((l: any) => l.link === this.activatedRoute.snapshot.params['id'])
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      })
    });
  }

}
