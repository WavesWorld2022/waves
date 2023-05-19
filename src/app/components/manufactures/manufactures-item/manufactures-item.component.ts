import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {StringParserService} from "../../../services/string-parser.service";
import {FireService} from "../../../services/fire.service";
import {IManufacturer} from "../../../shared/models";

@Component({
  selector: 'app-manufactures-item',
  templateUrl: './manufactures-item.component.html',
  styleUrls: ['./manufactures-item.component.scss']
})
export class ManufacturesItemComponent implements OnInit {
  manufacturer!: IManufacturer;
  isLoading = true;

  constructor(
    private fireService: FireService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public parserService: StringParserService
  ) { }

  ngOnInit() {
    this.fireService.onGetCollection('manufacturer');
    this.fireService.collectionData$.pipe(take(1)).subscribe((resp: any) => {
      this.manufacturer = resp.find((l: IManufacturer) => l.manufacturerKey === this.activatedRoute.snapshot.params['id'])
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }

}
