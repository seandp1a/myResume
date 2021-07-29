import { userData, UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public userList: userData[];
  public userListToView: userData[];
  public searchText:string;
  public searchType:string ='0';
  constructor(private userSvc: UserService) { }

  public getUserList(){
    this.userSvc.getUserList().subscribe((response) => {
      this.userList = response;
      this.userListToView = response;
    })
  }

  public doSearch(){
    if(this.searchText===""||this.searchText===undefined){
      this.userListToView = this.userList;
      return;
    }
    if(this.searchType === '0'){
      this.userListToView =  this.userList.filter((user)=>{
        return user.id.toString().includes(this.searchText);
      })
    }
    if(this.searchType === '1'){
      this.userListToView =  this.userList.filter((user)=>{
        return user.name.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
    if(this.searchType === '2'){
      this.userListToView =  this.userList.filter((user)=>{
        return user.email.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
  }

  ngOnInit(): void {
    this.getUserList();
  }

}
