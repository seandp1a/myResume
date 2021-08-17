import { BackendResponseInfo } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ARTICLE_API } from './apiName';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticleList(page: number = 1, user?: string) {
    if (user) {
      return this.http.get<ArticleListResponse>(ARTICLE_API + `?page=${page}&user=${user}`);
    } else {
      return this.http.get<ArticleListResponse>(ARTICLE_API + `?page=${page}`);
    }
  }

}

export interface ArticleListResponse extends BackendResponseInfo {
  data: {
    articles: ArticleData[],
    paginate: Paginate
  }
}

export interface ArticleData {
  content: string
  id: number
  sub_title: string
  title: string
  updated_at: string
  user_id: number
  user_name: string
}
export interface Paginate {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
