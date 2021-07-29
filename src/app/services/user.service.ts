import { GET_USER_LIST } from './apiName';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get<userData[]>(GET_USER_LIST);
  }
  deleteUser(){

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
