import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as DEVELOPERS from 'src/app/consts/developers.json';
import { ArticleData, ArticleService, Paginate, UserSimpleInfo } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-search-article',
  templateUrl: './search-article.component.html',
  styleUrls: ['./search-article.component.css']
})
export class SearchArticleComponent implements OnInit {

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private articleSvc: ArticleService,
    private userSvc: UserService
  ) { }

  public developers = (DEVELOPERS as any).default;

  public scrollToTopButtonShow = false;

  public scrollToTop() {
    window.scroll({
      top: 700,
      left: 0,
      behavior: 'smooth'
    });
  }

  public articleToDisplay: ArticleData[];
  public pageInfo: Paginate = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  }
  public articleAuthorInfo: UserSimpleInfo = {
    id: 0,
    name: '',
    image: '',
    introduction:''
  };

  public getArticleList(page: number = 1, user?: string) {
    this.articleToDisplay = [];
    this.articleSvc.getArticleList(page, user).subscribe((res) => {
      this.articleToDisplay = res.data.articles;
      this.pageInfo = res.data.paginate;
    })
  }
  public getArticleAuthorInfo(id){
    this.userSvc.getSingleUser(id).subscribe((res)=>{
      this.articleAuthorInfo.id = res.data.id;
      this.articleAuthorInfo.name = res.data.name;
      this.articleAuthorInfo.image = res.data.image;
      this.articleAuthorInfo.introduction = res.data.introduction;
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params['authorID']);
      this.getArticleList(1, params['authorID']);
      this.getArticleAuthorInfo(params['authorID']);
    });
  }

}
