import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('smoothCollapse', [
      state('initial', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('final', style({
        overflow: 'hidden',
        opacity: '1'
      })),
      transition('initial=>final', animate('500ms')),
      transition('final=>initial', animate('300ms'))
    ])
  ]
})
export class NavbarComponent implements OnInit {

  constructor() { }
  public isCollapsed = true;
  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.isCollapsed = false;
    }
    console.log(window.innerWidth)
  }

}
