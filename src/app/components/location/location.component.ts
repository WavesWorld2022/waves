import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {locations} from "../../../assets/json/locations";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  location: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      console.log(this.activatedRoute.snapshot.params['id'])
      this.location = locations.find(l => l.post && l.post.name === this.activatedRoute.snapshot.params['id'])
    });
  }

}
