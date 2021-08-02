import { REGEX_EMAIL, REGEX_PASSWORD } from './../../services/regex';
import { userData, UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList: userData[];
  public userListToView: userData[];
  public searchText: string;
  public searchType: string = '0';
  public successAlert:boolean = false;

  public insertFormGroup: FormGroup; // 新增表單控制

  get newName() { return this.insertFormGroup.get('newName'); }
  get newEmail() { return this.insertFormGroup.get('newEmail'); }
  get newPassword() { return this.insertFormGroup.get('newPassword'); }


  constructor(
    private userSvc: UserService,
    private formBuilder: FormBuilder
  ) { }

  // 取user
  public getUserList() {
    this.userSvc.getUserList().subscribe((response) => {
      this.userList = response;
      this.userListToView = response;
    })
  }

  // 新增user
  public insertUser() {
    const name = this.insertFormGroup.value.newName;
    const email = this.insertFormGroup.value.newEmail;
    const password = this.insertFormGroup.value.newPassword;
    if (name === '' || name === undefined) return;
    if (email === '' || email === undefined) return;
    if (password === '' || password === undefined) return;
    const body = { name: name, email: email, password: password }
    this.userSvc.insertUser(body).subscribe((res)=>{
      if(res.code === 200){
        this.successAlert=true;
        setTimeout(() => {
          this.insertFormGroup.reset();
          this.insertFormGroup.setValue({newEmail:'',newName:'',newPassword:''})
          this.successAlert=false;
        }, 1500);
      }else{
        const errEmail=res.message.email?`\nEmail錯誤：${res.message.email}`:'';
        const errPassword=res.message.password?`\nPassword錯誤：${res.message.password}`:'';
        alert(`錯誤代碼：${res.code}${errEmail}${errPassword}`);
      }
    })
  }

  // 執行篩選
  public doSearch() {
    if (this.searchText === "" || this.searchText === undefined) {
      this.userListToView = this.userList;
      return;
    }
    if (this.searchType === '0') {
      this.userListToView = this.userList.filter((user) => {
        return user.id.toString().includes(this.searchText);
      })
    }
    if (this.searchType === '1') {
      this.userListToView = this.userList.filter((user) => {
        return user.name.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
    if (this.searchType === '2') {
      this.userListToView = this.userList.filter((user) => {
        return user.email.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
  }

  ngOnInit(): void {
    this.getUserList();
    this.insertFormGroup = this.formBuilder.group({
      newEmail: ['', Validators.required],
      newPassword: ['', Validators.required],
      newName: ['', Validators.required]
    });
  }

}
