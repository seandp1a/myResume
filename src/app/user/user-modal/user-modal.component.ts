import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() id;
  @Input() token;
  @Input() loginId;

  isSameId = false;

  constructor(public activeModal: NgbActiveModal, private userSvc: UserService) { }

  public doDelete(modal) {


    this.userSvc.deleteUser(this.id.toString(), this.token).subscribe((res) => {
      if (res.status) {
        if (this.id === this.loginId) {
          modal.close('deleted_logout');
          return;
        }
        modal.close('deleted');
      } else {
        console.log(res);
      }
    })

  }
  ngOnInit(): void {
    console.log(this.id);
    this.isSameId = this.id === this.loginId ? true : false;
  }

}
