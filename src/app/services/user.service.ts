import { USER_API } from './apiName';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get<UserListResponse>(USER_API);
  }

  insertUser(body: { name: string, email: string, password: string }) {
    return this.http.post<BackendResponseInfo>(USER_API, body);
  }

  editUser(body: { name: string, image: string, member_token: string }, id: string) {
    return this.http.put<BackendResponseInfo>(USER_API + `/${id}`, body);
  }

  deleteUser(id: string, token: string) {
    let headers = new HttpHeaders();
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.request('delete', USER_API + `/${id}`, { body:{ member_token: token }, headers: headers });
  }





}

export interface BackendResponseInfo {
  code: number,
  message: ResponseMsg,
  status: boolean
}
export interface ResponseMsg {
  email?: string[];
  password?: string[];
  name?: string[];
  member_token?: string[];
}

export interface UserListResponse extends BackendResponseInfo{
 data:UserData[]
}

export interface UserData {
  id: number,
  name: string,
  email: string,
  email_verified_at: string,
  created_at: string,
  image: string
}


