import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { SingleArticleComponent } from './single-article/single-article.component';


@NgModule({
  declarations: [SingleArticleComponent],
  imports: [
    CommonModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
