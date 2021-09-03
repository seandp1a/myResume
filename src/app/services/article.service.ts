import { BackendResponseInfo } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ARTICLE_API, COMMENT_API } from '../consts/apiName';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  // Article 相關

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

  public postArticle(body: { title: string, content: string, member_token: string }) {
    return this.http.post<BackendResponseInfo>(ARTICLE_API, body);
  }

  public editArticle(body: { title: string, content: string, member_token: string },articleId:number){
    return this.http.put<BackendResponseInfo>(ARTICLE_API+`/${articleId}`, body);
  }
  public deleteArticle(token: string, articleId) {
    let headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.request<BackendResponseInfo>('delete', ARTICLE_API + `/${articleId}`, { body: { member_token: token }, headers: headers });
  }

  // Comment相關

  public sendComment(body: { article_id: number, content: string, member_token: string }, commentId?: number) {
    if (commentId) {
      return this.http.put<BackendResponseInfo>(COMMENT_API + `/${commentId}`, body);
    }
    return this.http.post<BackendResponseInfo>(COMMENT_API, body);
  }

  public deleteComment(token: string, commentId) {
    let headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.request<BackendResponseInfo>('delete', COMMENT_API + `/${commentId}`, { body: { member_token: token }, headers: headers });
  }

  public getCommentByArticleId(id: number) {
    return this.http.get<CommentResponse>(COMMENT_API + `?article_id=${id}`);
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

export interface CommentResponse extends BackendResponseInfo {
  data: Comment[]
}


export interface ArticleData {
  content: string
  id: number
  sub_title: string
  title: string
  updated_at: string
  user: UserSimpleInfo
  preview_content:string
}

export interface Paginate {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Comment {
  id: number,
  user: UserSimpleInfo,
  content: string,
  updated_at: string,
  logs: {
    content: string,
    updated_at: string
  }[]
}

export interface SingleArticle {
  comments: Comment[],
  length: number,
  content: string,
  id: number,
  sub_title: string,
  title: string,
  updated_at: string,
  user: UserSimpleInfo
}

export interface UserSimpleInfo {
  id: number,
  name: string,
  image: string,
  introduction?: string
}
