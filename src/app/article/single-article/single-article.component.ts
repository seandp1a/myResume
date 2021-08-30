import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal,
    public loginSvc: LoginService) {

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
  // 新增留言相關
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
  // 登入資料相關
  public isLogin = false;
  public loginUserInfo: LoginUser = {
    id: 0,
    name: '',
    image: '',
    email: '',
    member_token: ''
  };
  // 編輯留言相關
  public edditStatus = {
    mode: false,
    id: 0,
  }
  public edditEditorData;
  public deleteSuccessAlert = false;
  public deleteCommentId=0;

  getSingleArticle(id) {
    this.articleSvc.getSingleArticle(id).subscribe((res) => {
      this.articleDetail = res.data;
    })
  }

  insertCommit() {
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
        else {
          alert(res.message.member_token);
        }
      });
    }
  }

  edditComment(id) {
    if (this.edditEditorData && this.edditEditorData.trim() !== '') {
      this.articleSvc.sendComment({
        article_id: this.articleDetail.id,
        content: this.edditEditorData,
        member_token: this.loginUserInfo.member_token
      }, id).subscribe((res) => {
        if (res.code === 200) {
          this.getSingleArticle(this.articleDetail.id);
          setTimeout(() => {
            this.turnOffEditMode();
          }, 300);
        }
        else {
          alert(res.message.member_token);
        }
      });
    }
  }

  deleteComment(modal) {
      this.articleSvc.deleteComment(this.loginUserInfo.member_token,this.deleteCommentId).subscribe((res)=>{
        if(res.code === 200){
         this.deleteSuccessAlert = true;
         setTimeout(() => {
           modal.close('delete-complete');
         }, 1000);
        }else{
          alert(res.message.member_token);
        }
      })

  }

  // modal 在template被打開後 丟被指定的modal近來 用modalService去控制這個modal
  open(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      // 此處為modal 發生close事件 result為事件觸發原因
      console.log(`Modal close reason: ${result}`);
      this.deleteSuccessAlert = false;
      this.deleteCommentId = 0;
      this.getSingleArticle(this.articleDetail.id);
    }, (reason) => {
      // 此處為modal 發生dismiss事件 reason為事件觸發原因
      this.deleteSuccessAlert = false;
      this.deleteCommentId = 0;
      console.log(`Dismissed`);
    });
    this.deleteCommentId = id;
  }


  turnOnEditMode(id, content) {
    this.edditStatus.id = id;
    this.edditStatus.mode = true;
    this.edditEditorData = content;
  }
  turnOffEditMode() {
    this.edditStatus.id = 0;
    this.edditStatus.mode = false;
    this.edditEditorData = '';
  }


  ngOnInit(): void {
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getSingleArticle(res.id);
    });
    this.loginSvc.getLoginUserData().subscribe((res) => {
      this.loginUserInfo = res;
      this.isLogin = res ? true : false;
    }, (e) => {
      console.log(e);
    });
  }

}
