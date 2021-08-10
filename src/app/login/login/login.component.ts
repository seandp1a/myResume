import { LoginResponse } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email;
  public password;
  public isSuccess = false;

  constructor(private userSvc: UserService) { }
  public doLogin() {
    this.userSvc.loginUser({email:this.email,password:this.password}).subscribe((res:LoginResponse)=>{
      console.log(res);
      if(res.status===true){
        this.isSuccess = true;

      }
    })
  }
  ngOnInit(): void {
  }

}
