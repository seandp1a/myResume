import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { SingleArticleComponent } from './single-article/single-article.component';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [SingleArticleComponent],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    CKEditorModule
  ]
})
export class ArticleModule { }
