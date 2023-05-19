import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";
import {IWaveProductionMethod} from "../../../shared/models";

@Component({
  selector: 'app-technologies-item',
  templateUrl: './technologies-item.component.html',
  styleUrls: ['./technologies-item.component.scss']
})
export class TechnologiesItemComponent implements OnInit {
  isLoading = true;
  technology!: IWaveProductionMethod;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService,
    private fireService: FireService
  ) {
  }

  ngOnInit(): void {
    this.fireService.onGetCollection('production-methods');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.technology = resp.find((l: IWaveProductionMethod) => l.waveProductionMethodKey.replace(/^\/|\/$/g, '') === this.activatedRoute.snapshot.params['id']);
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }

}
