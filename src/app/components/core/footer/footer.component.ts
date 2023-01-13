import { Component } from '@angular/core';
import {Router, RoutesRecognized} from "@angular/router";
import {filter, pairwise} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  nav = [
    { title: 'explore', id: 'home' },
    { title: 'compare', id: 'compare' },
    { title: 'manufactures', id: 'manufactures' },
    { title: 'technologies', id: 'technologies' },
    { title: 'products', id: 'products' }
  ];

  constructor(router:Router) {
    router.events
        .pipe(filter((e: any) => e instanceof RoutesRecognized),
            pairwise()
        ).subscribe((e: any) => {
      const routes = JSON.parse(sessionStorage.getItem('prevRoutes')!) || [];
      routes.push(e[0].urlAfterRedirects)
      sessionStorage.setItem('prevRoutes', JSON.stringify(routes))
    })
  }
}
