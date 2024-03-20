import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IWaveLocation} from "../../../shared/models";
import {Subject, take, takeUntil} from "rxjs";
import {FireService} from "../../../services/fire.service";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  data: IWaveLocation[] = [];
  selected = '';

  constructor(private router: Router, private fireService: FireService) { }

  ngOnInit(): void {
    this.onGetLocations();
  }

  goToLocation(event: any) {
    this.router.navigate([`/location/${event.item.waveLocationKey}`])
  }

  onGetLocations() {
    this.fireService.onGetFourthCollection('locations');
    this.fireService.collectionFourthData$.pipe(take(1)).subscribe((resp: IWaveLocation[]) => {
      this.data = resp.filter((location: IWaveLocation) => location && location.waveLocationName);
    })
  }
}
