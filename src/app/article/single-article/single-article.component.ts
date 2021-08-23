import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService, SingleArticle } from 'src/app/services/article.service';
import { LoginUser, LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.css']
})
export class SingleArticleComponent implements OnInit {

  constructor(private articleSvc: ArticleService,
    private viewport: ViewportScroller,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public loginSvc: LoginService) {
    loginSvc.getLoginUserData().subscribe((res) => {
      this.loginUserInfo = res;
      this.isLogin = res ? true : false;
    }, (e) => {
      console.log(e);
    })
  }

  public articleDetail: SingleArticle = {
    comments: [],
    length: 0,
    content: '',
    id: 0,
    sub_title: '',
    title: '',
    updated_at: '',
    user: {
      id: 0,
      name: '',
      image: ''
    }
  }
  public editorData;

  public editorConfig = {
    toolbar: [
      ['Source'],
      ['Styles', 'Font', 'FontSize'],
      ['Bold', 'Italic'],
      ['Undo', 'Redo'],
      ['Image'],
      ['About']
    ],
    extraPlugins: 'editorplaceholder',
    editorplaceholder: '分享您的想法...',
  }

  public isLogin = false;

  public loginUserInfo: LoginUser = {
    id: 0,
    name: '',
    image: '',
    email: '',
    member_token: ''
  };

  getSingleArticle(id) {
    this.articleSvc.getSingleArticle(id).subscribe((res) => {
      this.articleDetail = res.data;
    })
  }

  doCommit() {
    if (this.editorData && this.editorData.trim() !== '') {
      this.articleSvc.sendComment({
        article_id: this.articleDetail.id,
        content: this.editorData,
        member_token: this.loginUserInfo.member_token
      }).subscribe((res) => {
        if (res.code === 200) {
          this.getSingleArticle(this.articleDetail.id);
          setTimeout(() => {
            this.editorData = '';
            this.viewport.scrollToPosition([0, 0]);
          }, 500);
        }
        else{
          alert(res.message.member_token);
        }
      })
    }
  }

  ngOnInit(): void {
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getSingleArticle(res.id);
    })
  }

}
