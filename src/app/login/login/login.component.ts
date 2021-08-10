
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse, LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private loginSvc: LoginService, private route: Router) { }

  public email: string;
  public password: string;

  public isSuccess = false;
  public doLogin() {
    this.loginSvc.loginUser({ email: this.email, password: this.password }).subscribe((res: LoginResponse) => {
      if (res.status === true) {
        this.isSuccess = true;
        this.loginSvc.loginUserInfo.next(res.data);
        sessionStorage.setItem('userData',JSON.stringify(res.data));
        setTimeout(() => {
          this.route.navigate(['/userList']);
        }, 1500);
      } else (
        alert('登入失敗')
      )
    })
  }
  ngOnInit(): void {
    if(this.loginSvc.isLogin()){
      this.route.navigate(['/userList']);
    }
  }

}
