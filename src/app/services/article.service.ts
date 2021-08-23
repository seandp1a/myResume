import { BackendResponseInfo } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ARTICLE_API, COMMENT_API } from './apiName';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }


  public getArticleList(page: number = 1, user?: string) {
    if (user) {
      return this.http.get<ArticleListResponse>(ARTICLE_API + `?page=${page}&user=${user}`);
    } else {
      return this.http.get<ArticleListResponse>(ARTICLE_API + `?page=${page}`);
    }
  }

  public getSingleArticle(id: number) {
    return this.http.get<SingleArticleResponse>(ARTICLE_API + `/${id}`);
  }

  public sendComment(body: { article_id: number, content: string, member_token: string }) {
    return this.http.post<BackendResponseInfo>(COMMENT_API, body);
  }



}

export interface ArticleListResponse extends BackendResponseInfo {
  data: {
    articles: ArticleData[],
    paginate: Paginate
  }
}
export interface SingleArticleResponse extends BackendResponseInfo {
  data: SingleArticle
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

export interface Comment {
  id: number,
  user: {
    id: number,
    name: string,
    image: string
  },
  content: string,
  updated_at: string
}

export interface SingleArticle {
  comments: Comment[],
  length: number,
  content: string,
  id: number,
  sub_title: string,
  title: string,
  updated_at: string,
  user: {
    id: number,
    name: string,
    image: string
  }
}
