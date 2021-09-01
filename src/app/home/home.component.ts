
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleData, ArticleService, Paginate } from './../services/article.service';
import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, query, stagger, AUTO_STYLE, group, sequence } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import * as DEVELOPERS from 'src/app/consts/developers.json';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('#page-body', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('articleAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-40%)' }),
          stagger('100ms', animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' })))
        ], { optional: true }),
        query(':leave',
          animate('300ms', style({ opacity: 0 })),
          { optional: true }
        )
      ])
    ]),
    trigger('smoothCollapse', [
      state('initial', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('final', style({
        overflow: 'hidden',
        opacity: '1',
        height: AUTO_STYLE
      })),
      // transition('initial=>final', animate('500ms ease-out')),
      // transition('final=>initial', animate('500ms ease-in')),
      transition('initial=>final', [
        sequence([
          style({ height: '0', overflow: 'hidden' }),
          query('.subtitle-link', style({ opacity: 0 })),
          animate('0.3s ease', style({ height: '*' })),
          query('.subtitle-link', animate('0.7s ease', style({ opacity: 1 }))),
        ])
      ]),
      transition('final=>initial', [
        sequence([
          style({ height: '*', overflow: 'hidden' }),
          query('.subtitle-link', style({ opacity: 1 })),
          query('.subtitle-link', animate('0.2s', style({ opacity: 0 }))),
          animate('0.3s', style({ height: 0 }))
        ])
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  constructor(
    private articleSvc: ArticleService,
    private viewport: ViewportScroller,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  @HostBinding('@pageAnimations')

  public articleToDisplay: ArticleData[];
  public scrollToTopButtonShow = false;
  public scrollState = '';

  @HostListener('window:scroll', ['$event'])

  onWindowScroll() {
    this.scrollToTopButtonShow = window.pageYOffset > 850 ? true : false;
  }

  public developers = (DEVELOPERS as any).default;

  public pageInfo: Paginate = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  }
  public listCollapse = true;

  public scrollToTop() {
    window.scroll({
      top: 700,
      left: 0,
      behavior: 'smooth'
    });
    // this.viewport.scrollToPosition([0, 700]);

  }


  public pageChange(e) {
    this.route.navigate(['..', e], {
      relativeTo: this.activatedRoute
    });
    // this.getArticleList(e);
    setTimeout(() => {
      this.scrollToTop();
    }, 300); // 換頁稍微遲緩
  }

  getArticleList(page: number = 1, user?: string) {
    this.articleToDisplay = [];
    this.articleSvc.getArticleList(page, user).subscribe((res) => {
      this.articleToDisplay = res.data.articles;
      this.pageInfo = res.data.paginate;
    })
  }

  public listCollapseToggle() {
    this.listCollapse = !this.listCollapse;
  }

  ngOnInit(): void {
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getArticleList(res.page);
    })
  }

}
