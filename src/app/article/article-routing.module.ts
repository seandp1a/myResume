import { InsertArticleComponent } from './insert-article/insert-article.component';
import { SearchArticleComponent } from './search-article/search-article.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleArticleComponent } from './single-article/single-article.component';


const routes: Routes = [
  { path: 'search', component: SearchArticleComponent, pathMatch: "full" },
  { path: 'post', component: InsertArticleComponent },
  { path: ':id', component: SingleArticleComponent },
  { path: '**', redirectTo: '/home/page/1' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
