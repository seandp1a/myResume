import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { LoginService, LoginUser } from '../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  host: {
    "(window:resize)": "onWindowResize($event)"
  },
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

  public pathName = '';
  public isCollapsed = true; // 展開/收起 = T/F
  public isLogin: boolean;
  public userName: string;
  private userData: LoginUser;

  constructor(private router: Router, private loginSvc: LoginService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.pathName = val.url.slice(1);
      }
    })
    this.loginSvc.getLoginUserData().subscribe((res)=>{
      this.userData = res;
      this.userName = res.name;
      this.isLogin = true;
    })
  }

  doLogout(){
    sessionStorage.clear();
    this.loginSvc.loginUserInfo.next();
    this.isLogin = false;
  }
  ngOnInit(): void {

  }
  onWindowResize(event) {
    this.isCollapsed = event.target.innerWidth < 992 ? false : true;

  }

}
