import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArticleService, Comment, SingleArticle } from 'src/app/services/article.service';
import { LoginUser, LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.css'],
  animations: [
    trigger('spinnerAnimations', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SingleArticleComponent implements OnInit {

  constructor(private articleSvc: ArticleService,
    private viewport: ViewportScroller,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public loginSvc: LoginService,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) { }

  public window = window;
  public subscribeForm: FormGroup;
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
  public commentToDisplay: Comment[] = [];
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
  // 刪除 留言&文章 相關
  public deleteSuccessAlert = false;
  public deleteMode = '';
  public deleteCommentId = 0;
  public deleteArticleId = 0;
  // progress
  public showProgressBar = false;
  public showProgressSpinner = true;

  getSingleArticle(id) {
    this.articleSvc.getSingleArticle(id).subscribe((res) => {
      if (res.code === 200) {
        this.showProgressSpinner = false;
        this.articleDetail = res.data;
      }

    })
  }

  editArticle() {
    this.route.navigate(['/article/post'], {
      queryParams: { id: this.articleDetail.id }
    });
  }

  deleteArticle(modal) {
    this.articleSvc.deleteArticle(this.loginUserInfo.member_token, this.deleteArticleId).subscribe((res) => {
      if (res.code === 200) {
        this.deleteSuccessAlert = true;
        setTimeout(() => {
          modal.close('delete-complete');
        }, 1000);
      } else {
        alert(res.message.member_token);
      }
    });
  }

  // Comment CRUD

  insertCommit() {
    if (this.editorData && this.editorData.trim() !== '') {
      this.articleSvc.sendComment({
        article_id: this.articleDetail.id,
        content: this.editorData,
        member_token: this.loginUserInfo.member_token
      }).subscribe((res) => {
        if (res.code === 200) {
          this.getCommentById(this.articleDetail.id);
          setTimeout(() => {
            this.editorData = '';
            // this.viewport.scrollToPosition([0, 0]);
          }, 500);
        }
        else {
          alert(res.message.member_token);
        }
      });
    }
  }

  edditComment(id) {
    this.showProgressBar = true;
    if (this.edditEditorData && this.edditEditorData.trim() !== '') {
      this.articleSvc.sendComment({
        article_id: this.articleDetail.id,
        content: this.edditEditorData,
        member_token: this.loginUserInfo.member_token
      }, id).subscribe((res) => {
        if (res.code === 200) {
          this.showProgressBar = false;
          this.getCommentById(this.articleDetail.id);
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
    this.articleSvc.deleteComment(this.loginUserInfo.member_token, this.deleteCommentId).subscribe((res) => {
      if (res.code === 200) {
        this.deleteSuccessAlert = true;
        setTimeout(() => {
          modal.close('delete-complete');
        }, 1000);
      } else {
        alert(res.message.member_token);
      }
    });
  }



  getCommentById(id) {
    this.articleSvc.getCommentByArticleId(id).subscribe((res) => {
      if (res.code === 200) {
        this.commentToDisplay = res.data;
      }
    })
  }

  private resetDelModal(type) {
    this.deleteSuccessAlert = false;
    if (type === 'c') {
      this.deleteCommentId = 0;
      this.deleteMode = '';
      this.getCommentById(this.articleDetail.id);
    }
    if (type === 'a') {
      this.deleteArticleId = 0;
      this.deleteMode = '';
      this.route.navigate(['/home/page']);
    }
  }

  // modal 在template被打開後 丟被指定的modal近來 用modalService去控制這個modal
  open(content, id, type) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      // 此處為modal 發生close事件 result為事件觸發原因
      console.log(`Modal close reason: ${result}`);
      this.resetDelModal(type);
    }, (reason) => {
      // 此處為modal 發生dismiss事件 reason為事件觸發原因
      this.resetDelModal(type);
      console.log(`Dismissed`);
    });
    if (type === 'c') this.deleteCommentId = id;
    if (type === 'a') this.deleteArticleId = id;
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

  pickDeleteMode(content, type, id) {
    this.deleteMode = (type === 'a') ? 'a' : 'c';
    this.open(content, id, type);
    // 1.判斷 刪除文章(type = a) or 刪除留言(type = c)
    //   並儲存於 this.deleteMode
    // 2.用open function打開modal
    // 3.判斷 刪除的是文章還是留言，給予其對應變數id
    //   (若type='a'，就把傳進來的id 放在this.deleteArticleId)
    // 4.modal上的刪除按鈕會判斷this.deleteMode是a OR c，而進入不同function
    // 5.完成刪除後將modal和用到的相關變數初始化
  }


  ngOnInit(): void {
    this.subscribeForm = this.formBuilder.group({
      email: ['']
    });
    console.log(this.viewport.getScrollPosition())
    this.viewport.scrollToPosition([0, 0]);
    this.activatedRoute.params.subscribe((res) => {
      this.getSingleArticle(res.id);
      this.getCommentById(res.id);
    });
    this.loginSvc.getLoginUserData().subscribe((res) => {
      this.loginUserInfo = res;
      this.isLogin = res ? true : false;
    }, (e) => {
      console.log(e);
    });

  }

}
