import { userData, UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // 資料相關
  private userList: userData[];
  public userListToView: userData[];
  private userListTemp: userData[];

  // 搜尋相關
  public searchText: string;
  public searchType: string = '0';
  public searchTypeName: string;
  private searchTypeMap = {
    '0': 'id',
    '1': 'name',
    '2': 'email'
  };

  // 頁碼相關
  public perPage = 10;
  public currentPage = 1;
  public totalPage: number;
  public pageArr: number[] = [];

  public insertFormGroup: FormGroup; // 新增表單控制

  closeResult = '';

  constructor(
    private userSvc: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }


  // API 取 user 資料
  public getUserList() {
    this.userSvc.getUserList().subscribe((response) => {
      this.userList = response;
      this.searchText === ""
      this.doSearch();
    })
  }

  // 針對userListTemp(篩後結果)進行分頁切割並顯示在網頁上
  public renderPage(page: number) {
    this.currentPage = page;
    const firstIndex = (this.currentPage - 1) * this.perPage;
    this.userListToView = this.userListTemp.slice(firstIndex, firstIndex + this.perPage);
  }

  // 重算頁碼
  private resetPage() {
    this.totalPage = Math.ceil(this.userListTemp.length / this.perPage);
    this.pageArr = [];
    for (let i = 0; i < this.totalPage; i++) {
      this.pageArr.push(i + 1);
    }
  }

  // 執行篩選
  public doSearch() {
    // 無篩選的話，直接將總資料丟到userListTemp
    this.searchTypeName = this.searchTypeMap[this.searchType]
    if (this.searchText === "" || this.searchText === undefined) {
      this.userListTemp = this.userList;
      this.resetPage();
      this.renderPage(1);
      return;
    }
    // 有篩選的話，先用temp存篩後結果，再丟到userListTemp
    let temp: userData[];
    temp = this.userList.filter((user) => {
      return user[this.searchTypeName].toString().toLowerCase().includes(this.searchText.toLowerCase());
    })
    this.userListTemp = temp;
    this.resetPage(); // 算頁數
    this.renderPage(1); // 算完渲染
  }

  // 依當前searchType 建立對應的input文字提示陣列
  private makeSearchArray(): string[] {
    return this.userList.map(v => v[this.searchTypeName].toString())
  }

  // ng-typeahead 搜尋  readonly 後面放提示文字陣列
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.makeSearchArray().filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),

    )

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.getUserList();

  }

}
