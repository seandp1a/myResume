import { ActivatedRoute, Router } from '@angular/router';
import { ArticleData, ArticleService, Paginate } from './../services/article.service';
import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';

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
        query(':enter',[
          style({ opacity: 0 ,transform: 'translateX(-40%)'}),
          stagger('100ms', animate('500ms ease-out', style({ opacity: 1 ,transform: 'translateX(0%)'})))
        ],{ optional: true }),
        query(':leave',
          animate('300ms', style({ opacity: 0 })),
          { optional: true }
        )
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

  public developers = [
    {
      name: 'Usong',
      major: 'Front-End Web Developer',
      photo: '/assets/images/author/頭貼.jpg',
      fb: 'https://www.facebook.com/yousong.zhang/',
      ig: 'https://www.instagram.com/seanttc/',
      gh: 'https://github.com/seandp1a'
    }, {
      name: 'Roy',
      major: 'Back-End Web Developer',
      photo: '/assets/images/author/阿怎樣嘞.png',
      fb: 'https://www.facebook.com/roy22887/',
      ig: 'https://www.instagram.com/comman24/',
      gh: 'https://github.com/cc711612'
    }
  ];

  public pageInfo: Paginate = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  }

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
    this.articleToDisplay=[];
    this.articleSvc.getArticleList(page, user).subscribe((res) => {
      this.articleToDisplay = res.data.articles;
      this.pageInfo = res.data.paginate;
    })
  }

  ngOnInit(): void {
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getArticleList(res.page);
    })
  }

}
