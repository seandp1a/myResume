import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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

  public pathName = 'home/page/1';
  private isMobile = true;
  public isCollapsed = true; // 展開/收起 = T/F
  public isLogin: boolean;
  public userName: string;
  private userData: LoginUser;
  private windowY = 0;
  public isScrollUp = true;
  public navColor = false;

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
    // 桌機 首頁 往下滑到836 && 手機 首頁 往下滑到470 => navBar透明化
    if (!this.isMobile && this.windowY >= 836 && this.pathName.includes('home/page')) {
      this.navColor = true;
    } else if (this.isMobile && this.windowY >= 470 && this.pathName.includes('home/page')) {
      this.navColor = true;
    } else {
      this.navColor = false;
    }


  }

  constructor(private router: Router, private loginSvc: LoginService,private activatedRoute: ActivatedRoute) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.pathName = val.url.slice(1)?val.url.slice(1):'home/page/1';
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
    },(e)=>{
      console.log(e)
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
    this.isMobile = window.innerWidth < 992 ? true : false;
    this.isCollapsed = window.innerWidth < 992 ? false : true;
  }
  onWindowResize(event) {
    this.isCollapsed = event.target.innerWidth < 992 ? false : true;
    this.isMobile = event.target.innerWidth < 992 ? true : false;
  }

}
