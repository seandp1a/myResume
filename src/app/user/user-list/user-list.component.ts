import { userData, UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private userList: userData[];
  public userListToView: userData[];
  private userListTemp:userData[];
  public searchText: string;
  public searchType: string = '0';

  public perPage = 10;
  public currentPage = 1;
  public totalPage:number;
  public pageArr:number[]=[];

  public insertFormGroup: FormGroup; // 新增表單控制

  constructor(
    private userSvc: UserService,
    private formBuilder: FormBuilder
  ) { }

  // 取user
  public getUserList() {
    this.userSvc.getUserList().subscribe((response) => {
      this.userList = response;
      this.searchText === ""
      this.doSearch();
    })
  }

  // 針對userListTemp(篩後結果)進行分頁切割並顯示在網頁上
  public renderPage(page:number){
    this.currentPage = page;
    const firstIndex = (this.currentPage-1)*this.perPage;
    this.userListToView = this.userListTemp.slice(firstIndex,firstIndex+ this.perPage);
  }


  // 新增user
  public insertUser() {

  }


  private resetPage(){
    this.totalPage = Math.ceil(this.userListTemp.length / this.perPage);
    this.pageArr=[];
    for(let i =0 ;i<this.totalPage;i++){
      this.pageArr.push(i+1);
    }
  }

  // 執行篩選
  public doSearch() {
    // 無篩選的話，直接將總資料丟到userListTemp
    if (this.searchText === "" || this.searchText === undefined) {
      this.userListTemp = this.userList;
      this.resetPage();
      this.renderPage(1);
      return;
    }
    // 有篩選的話，先用temp存篩後結果，再丟到userListTemp
    let temp:userData[];
    if (this.searchType === '0') {
      temp = this.userList.filter((user) => {
        return user.id.toString().includes(this.searchText);
      });

    }
    if (this.searchType === '1') {
      temp = this.userList.filter((user) => {
        return user.name.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
    if (this.searchType === '2') {
      temp = this.userList.filter((user) => {
        return user.email.toLowerCase().includes(this.searchText.toLowerCase());
      })
    }
    this.userListTemp = temp;
    this.resetPage();
    this.renderPage(1);
  }

  ngOnInit(): void {
    this.getUserList();

  }

}
