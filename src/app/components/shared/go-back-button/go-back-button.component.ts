import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {JSONFile} from "@angular/cli/src/utilities/json-file";
import {HomeComponent} from "../../home/home.component";

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.scss']
})
export class GoBackButtonComponent implements OnInit {

  isDesktop!: boolean;
  route: any;
  isLocationPage!: boolean;

  constructor(
      private router: Router,
  ) {}

    ngOnInit() {
        this.isDesktop = innerWidth >= 768;
        this.route = this.router.url.split('/').filter(item => item);
        this.isLocationPage = this.route.includes('location');
    }

    goBack(): void {
    this.route.pop();
    this.router.navigate(['/home']);
  }
}
