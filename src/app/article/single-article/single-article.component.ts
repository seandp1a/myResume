import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService, SingleArticle } from 'src/app/services/article.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.css']
})
export class SingleArticleComponent implements OnInit {

  constructor(private articleSvc: ArticleService,
    private viewport: ViewportScroller,
    private route: Router,
    private activatedRoute: ActivatedRoute) { }

  public articleDetail:SingleArticle= {
    comments: [],
    length: 0,
    content:'',
    id: 0,
    sub_title: '',
    title: '',
    updated_at: '',
    user:{
      id:0,
      name:'',
      image:''
    }
  }

  getSingleArticle(id){
    this.articleSvc.getSingleArticle(id).subscribe((res)=>{
      this.articleDetail = res.data;
    })
  }

  ngOnInit(): void {
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getSingleArticle(res.id);
    })
  }

}
