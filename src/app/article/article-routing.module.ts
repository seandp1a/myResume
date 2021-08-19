import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleArticleComponent } from './single-article/single-article.component';


const routes: Routes = [
  { path: ':id', component: SingleArticleComponent },
  { path:'**',redirectTo:'/home/page/1'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
