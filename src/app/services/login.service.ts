import { USER_API, LOGIN_API, LOGOUT_API } from './apiName';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BackendResponseInfo, UserListResponse, UserData } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
    this.isLogin();
  }


  public loginUserInfo = new ReplaySubject<LoginUser | null>(1);

  /**
   * 如果loginUserInfo(replaySubject)有值，回傳true
   * 如果loginUserInfo沒有值，看sessionStorage，有值將值補回loginUserInfo並回傳true
   * 都沒值回傳false
   * @returns
   */
  isLogin() {
    this.loginUserInfo.subscribe((res) => {
      if (res) {
        return true;
      }
    });

    if (sessionStorage.getItem('userData')) {
      const id = JSON.parse(sessionStorage.getItem('userData')).id;
      const token = JSON.parse(sessionStorage.getItem('userData')).member_token;
      this.getLatestUserData(id, token);
      return true;
    }
    return false;
  }

  getLatestUserData(id: number, token: string) {
    this.http.get<LatestUserResponse>(USER_API + `/${id}`).subscribe((res: LatestUserResponse) => {
      const temp = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        image: res.data.image,
        member_token: token
      }
      this.loginUserInfo.next(temp);
    })
  }

  getLoginUserData() {
    return this.loginUserInfo.asObservable();
  }

  loginUser(body: { email: string; password: string }) {
    return this.http.post<LoginResponse>(LOGIN_API, body);
  }

  logoutUser(token: string) {
    sessionStorage.clear();
    this.loginUserInfo.next(null);
    this.http.post(LOGOUT_API, { member_token: token });
  }

}

export interface LoginUser {
  id: number,
  name: string,
  email: string,
  image: string,
  member_token: string
}

export interface LatestUserResponse extends BackendResponseInfo {
  data: UserData;
}

export interface LoginResponse extends BackendResponseInfo {
  data: LoginUser
}
