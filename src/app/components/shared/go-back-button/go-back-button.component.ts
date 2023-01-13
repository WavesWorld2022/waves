import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {JSONFile} from "@angular/cli/src/utilities/json-file";

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.scss']
})
export class GoBackButtonComponent implements OnInit {

  isDesktop!: boolean;
  route: any;
  isNextStepToHome!: boolean;

  constructor(
      private router: Router
  ) {}

    ngOnInit() {
        this.isDesktop = innerWidth >= 768;
        this.route = this.router.url.split('/').filter(item => item);
        this.isNextStepToHome = this.route.length === 1;
    }

    goBack(): void {
    this.route.pop();
    this.router.navigate([this.route.join('/')]);
  }
}
