import { ArticleData, ArticleService } from './../services/article.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEventDirection, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private articleSvc: ArticleService) { }
  public articleToDisplay: ArticleData[];

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

  getArticleList(page: number = 1, user?: string) {
    this.articleSvc.getArticleList(page, user).subscribe((res) => {
      this.articleToDisplay = res.data.articles;
    })
  }

  ngOnInit(): void {
    this.getArticleList();
  }

}
