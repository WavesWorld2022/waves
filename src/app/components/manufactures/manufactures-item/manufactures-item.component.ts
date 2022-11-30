import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {locations} from "../../../../assets/json/locations";
import {manufacturer} from "../../../../assets/json/manufacturer";

@Component({
  selector: 'app-manufactures-item',
  templateUrl: './manufactures-item.component.html',
  styleUrls: ['./manufactures-item.component.scss']
})
export class ManufacturesItemComponent {
  manufacturer: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.manufacturer = manufacturer.find(l => l.link === this.activatedRoute.snapshot.params['id'])
    });
  }

}
