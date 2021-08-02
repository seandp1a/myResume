import { InsertRes, UserService } from './../../services/user.service';
import { REGEX_EMAIL } from './../../services/regex';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public successAlert: boolean = false;
  public insertFormGroup: FormGroup; // 新增表單控制
  public isSended: boolean = false;
  public errorMsg = {
    email: {
      status: true,
      message: ''
    },
    name: {
      status: true,
      message: ''
    },
    password: {
      status: true,
      message: ''
    }
  };

  get name() { return this.insertFormGroup.get('name'); }
  get email() { return this.insertFormGroup.get('email'); }
  get password() { return this.insertFormGroup.get('password'); }

  constructor(
    private formBuilder: FormBuilder,
    private userSvc: UserService,
    private route: Router) {
  }


  private initErrMsg(){
    this.errorMsg = {
      email: {
        status: true,
        message: ''
      },
      name: {
        status: true,
        message: ''
      },
      password: {
        status: true,
        message: ''
      }
    }
  }
  private createErrorMsg(res?: InsertRes): void {
    console.log(res);
    for (let i of ['email', 'name', 'password']) {
      if(res.message[i]){
        this.errorMsg[i].message= res.message[i]
        this.errorMsg[i].status =false;
      }else{
        this.errorMsg[i].status =true;
      }
    }
    console.log(this.errorMsg);
  }
  public isValid(inputName): boolean {
    const inputControl = this.insertFormGroup.controls[inputName];
    return inputControl.invalid && inputControl.dirty || this.isSended;
  }
  public doInsert() {
    this.isSended = true;
    const body = {
      name: this.insertFormGroup.value.name || '',
      email: this.insertFormGroup.value.email || '',
      password: this.insertFormGroup.value.password || ''
    }
    if(this.insertFormGroup.invalid){
      return;
    }
    this.userSvc.insertUser(body).subscribe((res: InsertRes) => {
      if (res.code === 200) {
        this.initErrMsg();
        this.successAlert = true;
        setTimeout(() => {
          this.route.navigate(['/userList']);
        }, 2000);
      } else {
        this.createErrorMsg(res);
      }
    })
  }



  ngOnInit(): void {
    this.insertFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

  }

}


