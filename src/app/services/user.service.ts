import { USER_API} from './apiName';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get<UserData[]>(USER_API);
  }

  insertUser(body: { name: string,email: string,password: string }) {
    return this.http.post<BackendResponseInfo>(USER_API, body);
  }

  editUser(body: { name: string, password: string, }, id: string) {
    return this.http.put<BackendResponseInfo>(USER_API + `/${id}`, body);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(USER_API + `/${id}`)
  }





}

export interface BackendResponseInfo{
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


export interface UserData {
  id: string,
  name: string,
  email: string,
  email_verified_at: string,
  created_at: string,
  image: string
}


