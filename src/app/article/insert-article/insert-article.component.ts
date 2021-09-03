import { ArticleService, SingleArticle } from 'src/app/services/article.service';
import { LoginService, LoginUser } from 'src/app/services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-insert-article',
  templateUrl: './insert-article.component.html',
  styleUrls: ['./insert-article.component.css']
})
export class InsertArticleComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private loginSvc: LoginService,
    private articleSvc: ArticleService,
    private _snackBar: MatSnackBar,
    private route: Router,
    private activatedRoute: ActivatedRoute,) { }

  public horizontalPosition: MatSnackBarHorizontalPosition = 'center'; // start,center,end,left,right
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom'; // top , bottom
  private unsubscriber = new Subject;
  public postFormGroup: FormGroup;
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
    height: '400'
  }
  private loginUserInfo: LoginUser;
  private oldAritcle: SingleArticle;
  public mode = 0; // 0=post, 1=put

  get title() { return this.postFormGroup.controls.title; }
  get content() { return this.postFormGroup.controls.content; }

  public postArticle() {
    if (this.postFormGroup.pristine) {
      this.title.markAsTouched();
      this.content.markAsTouched();
      return
    }
    if (this.postFormGroup.invalid) {
      return
    }
    const body = {
      title: this.title.value,
      content: this.content.value,
      member_token: this.postFormGroup.get('member_token').value
    }
    this.articleSvc.postArticle(body).subscribe((res) => {
      if (res.code === 200) {
        this._snackBar.open('文章已發送!!', '', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        setTimeout(() => {
          this.route.navigate(['/home/page/']);
        }, 2000);
      } else {
        alert(res.message.member_token);
      }
    })

    // 檢測 string 轉成 html 的innerText 長度
    // const parser = new DOMParser();
    // const stringToHTML = parser.parseFromString(this.postFormGroup.get('content').value,'text/html');
    // console.log(stringToHTML.body.innerText.trim().length);

  }

  public editArticle() {
    // console.log(this.oldAritcle.content.trim()===this.postFormGroup.controls.content.value.trim());
    // console.log(this.postFormGroup.touched,this.postFormGroup.pristine,this.postFormGroup.dirty);
    // return
    // 啥都沒改
    if (this.oldAritcle.content.trim() === this.postFormGroup.controls.content.value.trim()
      && this.oldAritcle.title.trim() === this.postFormGroup.controls.title.value.trim()) {
      // 啥都沒動
      if (!this.postFormGroup.touched) {
        alert('啥都沒動你點爽的?');
        return
      }
      alert('啥都沒改你點爽的?');
      return
    }
    // 格式不符
    if (this.postFormGroup.invalid) {
      return
    }
    const body = {
      title: this.title.value,
      content: this.content.value,
      member_token: this.postFormGroup.get('member_token').value
    }
    this.articleSvc.editArticle(body,this.oldAritcle.id).subscribe((res) => {
      if (res.code === 200) {
        this._snackBar.open('修改成功!!', '', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        setTimeout(() => {
          this.route.navigate(['/home/page/']);
        }, 2000);
      } else {
        alert(res.message.member_token);
      }
    })
  }

  ngOnInit(): void {
    this.postFormGroup = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      content: ['', [htmlContentMinLength]],
      member_token: ['', [Validators.required]]
    });

    this.loginSvc.getLoginUserData().pipe(
      takeUntil(this.unsubscriber)
    ).subscribe((user) => {
      // 因為是replaySubject，若之前給過值他會直接給上次的值
      // 故為同步處理，要patch FormGroup的資料 得在其實體化之後執行
      if (user) {
        this.postFormGroup.controls.member_token.patchValue(user.member_token);
        this.loginUserInfo = user;
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params['id']);
      if (params['id']) {
        this.articleSvc.getSingleArticle(params['id']).subscribe((res) => {
          if (res.code === 200 && res.data.user.id === this.loginUserInfo.id) {
            this.postFormGroup.controls.title.patchValue(res.data.title);
            this.postFormGroup.controls.content.patchValue(res.data.content);
            this.oldAritcle = res.data;
            this.mode = 1;
          } else {
            alert('您無此權限修改此文章');
            this.route.navigate(['/home/page/']);
          }
        })
      }
    });


  }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
// 自定義 form validator
export function htmlContentMinLength(input: AbstractControl) {
  const parser = new DOMParser();
  const stringToHTML = parser.parseFromString(input.value, 'text/html');
  let invalid = false;
  if (stringToHTML.body.innerText.trim().length < 15) {
    invalid = true;
  }
  return invalid == true ? { wrongLength: true } : null
}
