import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';



@NgModule({
  declarations: [ArticleCardComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    CommonModule,
    ArticleCardComponent
  ]
})
export class ComponentsModule { }
