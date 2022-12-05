import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {technologies} from "../../../../assets/json/technologies";
import {StringParserService} from "../../../services/string-parser.service";

@Component({
  selector: 'app-technologies-item',
  templateUrl: './technologies-item.component.html',
  styleUrls: ['./technologies-item.component.scss']
})
export class TechnologiesItemComponent implements OnInit {
 technology: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.technology = technologies.find(l => l.permalink.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
    });
  }

  ngOnInit(): void {
  }

}
