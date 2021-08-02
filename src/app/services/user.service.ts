import { GET_USER_LIST, USER_API } from './apiName';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get<userData[]>(USER_API);
  }

  insertUser(body:InsertBody) {
    return this.http.post<InsertRes>(USER_API, body);
  }

  deleteUser() {

  }

}

export interface userData {
  id: string,
  name: string,
  email: string,
  email_verified_at: string,
  created_at: string,
  updated_at: string
}

export interface InsertBody{
  name:string,
  email:string,
  password:string
}

export interface InsertRes {
  code: number,
  message: InsertResErrorMsg,
  status: boolean
}

export interface InsertResErrorMsg {
  email?: string[];
  password?: string[];
  name?:string[];
}
