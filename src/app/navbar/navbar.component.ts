import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, HostListener } from '@angular/core';
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
  private windowY = 0;
  public isScrollUp = true;

  @HostListener('window:scroll', ['$event'])

  onWindowScroll() {
    let element = document.querySelector('.navbar') as HTMLElement;
    if (window.pageYOffset > this.windowY) {
      element.classList.add('nav-hide');
      this.isScrollUp = false;
    } else {
      element.classList.remove('nav-hide');
      this.isScrollUp = true;
    }
    this.windowY = window.pageYOffset;
  }

  constructor(private router: Router, private loginSvc: LoginService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.pathName = val.url.slice(1);
      }
    })
    loginSvc.loginUserInfo.subscribe((res) => {
      if (res !== null) {
        this.isLogin = true;
        this.userData = res;
        this.userName = res.name ? res.name : '';
      } else {
        this.isLogin = false;
      }
    })
    if (loginSvc.isLogin()) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }

  }

  doLogout() {
    this.loginSvc.logoutUser(this.userData.member_token);
    this.isLogin = false;
  }
  ngOnInit(): void {
    this.isLogin = this.loginSvc.isLogin();
  }
  onWindowResize(event) {
    this.isCollapsed = event.target.innerWidth < 992 ? false : true;

  }

}
