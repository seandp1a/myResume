import { USER_API, LOGIN_API } from './apiName';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BackendResponseInfo } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
    this.isLogin();
   }


  public loginUserInfo = new ReplaySubject<LoginUser>(1);

  isLogin(){
    this.loginUserInfo.subscribe((res)=>{
      if(res){
        return true;
      }
    });
    if(sessionStorage.getItem('userData')){
      this.loginUserInfo.next(JSON.parse(sessionStorage.getItem('userData')));
      return true;
    }
    return false;
  }

  getLoginUserData(){
    return this.loginUserInfo.asObservable();
  }

  loginUser(body: { email: string; password: string }) {
    return this.http.post<LoginResponse>(LOGIN_API, body);
  }

}

export  interface LoginUser{
  id:number,
  name:string,
  email:string,
  image:string,
  member_token:string
}
export interface LoginResponse extends BackendResponseInfo{
  data:LoginUser
}
