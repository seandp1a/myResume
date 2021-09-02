import { ArticleService } from 'src/app/services/article.service';
import { LoginService, LoginUser } from 'src/app/services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
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
    private route: Router) { }

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

  get title() { return this.postFormGroup.controls.title; }
  get content() { return this.postFormGroup.controls.content; }

  public postArticle() {
    console.log(this.postFormGroup);
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
        this._snackBar.open('文章已發送!!','',{
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        setTimeout(() => {
          this.route.navigate(['/home/page/']);
        }, 2000);
      }
    })

    // 檢測 string 轉成 html 的innerText 長度
    // const parser = new DOMParser();
    // const stringToHTML = parser.parseFromString(this.postFormGroup.get('content').value,'text/html');
    // console.log(stringToHTML.body.innerText.trim().length);

  }

  ngOnInit(): void {
    console.log(0)
    this.postFormGroup = this.formBuilder.group({
      title: ['', [Validators.required,Validators.maxLength(20)]],
      content: ['', [htmlContentMinLength]],
      member_token: ['', [Validators.required]]
    });
    this.loginSvc.getLoginUserData().pipe(
      takeUntil(this.unsubscriber)
    ).subscribe((user) => {
      if (user) {
        this.postFormGroup.controls.member_token.patchValue(user.member_token);
        console.log(1)
      }
    });
    console.log(2)

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
