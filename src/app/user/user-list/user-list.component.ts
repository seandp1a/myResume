import { UserData, UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../user-modal/user-modal.component';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // 資料相關
  private userList: UserData[];
  public userListToView: UserData[];
  private userListTemp: UserData[];

  // 搜尋相關
  public searchContent: UserData | string;
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
      this.searchContent === "";
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

    this.searchTypeName = this.searchTypeMap[this.searchType];

    // 清空搜尋欄，初始化陣列
    if (this.searchContent === "" || this.searchContent === undefined) {
      this.userListTemp = this.userList;
      this.resetPage();
      this.renderPage(1);
      return;
    }

    // 有篩選的話，先用temp存篩後結果，再丟到userListTemp
    let temp: UserData[];

    // 當點了搜尋提示選項，ngmodel type 會變成物件，且篩選結果會變成只有一筆資料
    if (typeof (this.searchContent) === 'object') {
      const userId = this.searchContent.id;
      temp = this.userList.filter((user) => {
        return user.id === userId;
      })
    } else {
      temp = this.userList.filter((user) => {
        return user[this.searchTypeName].toString().toLowerCase().includes(this.searchContent.toString().toLowerCase());
      })
    }
    this.userListTemp = temp;
    this.resetPage(); // 算頁數
    this.renderPage(1); // 算完渲染
  }

  // typeahead input/output 顯示轉型
  formatter = (state: UserData) => state[this.searchTypeName];

  // ng-typeahead 搜尋  readonly 後面放提示文字陣列
  search: OperatorFunction<string, readonly UserData[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.userList.filter(v => v[this.searchTypeName].toString().toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
    )

  // 初始化 modal alert
  private resetAlert() {
    this.formChanged = true;
    this.alertType = 'warning';
    this.alertText = '警告！您沒更改任何資料！';
  }

  // modal 在template被打開後 丟被指定的modal近來 用modalService去控制這個modal
  open(content, user: UserData) {
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
        this.alertText =
          (res.message.name ? res.message.name[0] : '') + ' ' +
          (res.message.password ? res.message.password[0] : '') + ' ' +
          (res.message.member_token ? '尚未登入' : '');
        console.log('更新失敗res：', res)
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

  public doDelete(modal) {
    const modalRef = this.modalService.open(UserModalComponent, { size: 'md' });
    modalRef.componentInstance.id = this.editFormGroup.controls.id.value;
    modalRef.result.then((result) => {
      modal.close();
    }, (reason) => {
      console.log('取消刪除');
    })
  }

  ngOnInit(): void {
    this.getUserList();
  }

}
