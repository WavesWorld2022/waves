import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";

@Component({
  selector: 'app-technologies-item',
  templateUrl: './technologies-item.component.html',
  styleUrls: ['./technologies-item.component.scss']
})
export class TechnologiesItemComponent implements OnInit {
  isLoading = true;
  technology: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService,
    private fireService: FireService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fireService.onGetCollection('technologies').subscribe((resp: any) => {
        resp.forEach((l: any) => console.log(l.permalink.replace(/^\/|\/$/g, '')))
        this.technology = resp.find((l: any) => l.permalink.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      })
    });
  }

  ngOnInit(): void {}

}
