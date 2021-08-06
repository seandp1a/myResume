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

  // Modal相關
  public editFormGroup: FormGroup; // 更新表單控制
  public formChanged = true;
  public alertText = '警告！您沒更改任何資料！';
  public alertType = 'warning';

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

  // 初始化alert
  private resetAlert() {
    this.formChanged = true;
    this.alertType = 'warning';
    this.alertText = '警告！您沒更改任何資料！';
  }

  // modal 在template被打開後 丟被指定的modal近來 用modalService去控制這個modal
  open(content, user: userData) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      // 此處為modal 發生close事件 result為事件觸發原因
      console.log(`Closed with: ${result}`);
      this.resetAlert();
    }, (reason) => {
      // 此處為modal 發生dismiss事件 reason為事件觸發原因
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
      this.resetAlert();
    });
    this.editFormGroup = this.formBuilder.group({
      id: [{ value: user.id, disabled: true }, Validators.required],
      email: [{ value: user.email, disabled: true }, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [user.name, [Validators.required, Validators.minLength(2)]]
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

  public doUpdate(modal) {
    // input都沒碰過跳alert
    if (!this.editFormGroup.dirty) {
      this.formChanged = false;
      return;
    }
    this.formChanged = true;
    const editBody = {
      name: this.editFormGroup.value.name,
      password: this.editFormGroup.value.password
    }
    this.userSvc.editUser(editBody, this.editFormGroup.controls['id'].value).subscribe((res) => {
      if (res.status !== true) {
        this.formChanged = false;
        this.alertType = 'danger';
        this.alertText = (res.message.name ? res.message.name[0] : '') + ' ' + (res.message.password ? res.message.password[0] : '');
        return
      }
      this.formChanged = false;
      this.alertType = 'success';
      this.alertText = '修改成功！';
      setTimeout(() => {
        modal.close('Update')
        this.getUserList();
      }, 1500);
    })

  }

  ngOnInit(): void {
    this.getUserList();
  }

}
