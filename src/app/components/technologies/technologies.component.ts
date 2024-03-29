import { Component, OnInit } from '@angular/core';
import {FireService} from "../../services/fire.service";

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss']
})
export class TechnologiesComponent implements OnInit {
  isLoading = false;
  activeFilter = 'f-1';

  nav = [
    {id: 'f-1', title: 'All', icon: 'shield-0'},
    {id: 'f-2', title: 'ME', icon: 'shield-1'},
    {id: 'f-3', title: 'R', icon: 'shield-2'},
    {id: 'f-4', title: 'S', icon: 'shield-3'},
    {id: 'f-5', title: 'R', icon: 'shield-4'},
    {id: 'f-6', title: 'TT', icon: 'shield-0'},
    {id: 'f-7', title: '[-', icon: 'shield-5'},
    {id: 'f-8', title: '[', icon: 'shield-6'},
    {id: 'f-9', title: '[-]', icon: 'shield-0'},
    {id: 'f-10', title: '<8', icon: 'shield-0'}
  ];
  technologies: any[] = [];

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
    this.fireService.onGetCollection('technologies').subscribe(resp => {
      resp.sort((a: any, b: any ) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
        .forEach((m: any) => {
          this.technologies.push(m);
        })
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    })
  }
}
