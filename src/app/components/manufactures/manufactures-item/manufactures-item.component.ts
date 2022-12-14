import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {manufacturer} from "../../../../assets/json/manufacturer";
import {StringParserService} from "../../../services/string-parser.service";

@Component({
  selector: 'app-manufactures-item',
  templateUrl: './manufactures-item.component.html',
  styleUrls: ['./manufactures-item.component.scss']
})
export class ManufacturesItemComponent {
  manufacturer: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.manufacturer = manufacturer.find(l => l.link === this.activatedRoute.snapshot.params['id'])
    });
  }

}
