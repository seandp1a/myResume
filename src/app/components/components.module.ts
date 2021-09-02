import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './article-card/article-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [ArticleCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    ArticleCardComponent,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class ComponentsModule { }
