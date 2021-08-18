import { ActivatedRoute, Router } from '@angular/router';
import { ArticleData, ArticleService, Paginate } from './../services/article.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEventDirection, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private articleSvc: ArticleService,
    private viewport: ViewportScroller,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }
  public articleToDisplay: ArticleData[];
  public scrollToTopButtonShow = false;

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
    this.viewport.scrollToPosition([0, 700]);
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
