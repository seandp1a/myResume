import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { SingleArticleComponent } from './single-article/single-article.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { SearchArticleComponent } from './search-article/search-article.component';
import { InsertArticleComponent } from './insert-article/insert-article.component';


@NgModule({
  declarations: [SingleArticleComponent, SearchArticleComponent, InsertArticleComponent],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    CKEditorModule,
    NgbModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class ArticleModule { }
