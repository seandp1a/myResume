import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { ArticleComponent } from './article/article.component';



@NgModule({
  declarations: [HomeComponent, ArticleComponent],
  imports: [
    CommonModule, FormsModule, HomeRoutingModule ,NgbModule
  ]
})
export class HomeModule { }
