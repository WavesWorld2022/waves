import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  nav = [
    { title: 'explore', id: 'home' },
    { title: 'compare', id: 'compare' },
    { title: 'manufactures', id: 'manufactures' },
    { title: 'technologies', id: 'technologies' },
    { title: 'products', id: 'products' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
