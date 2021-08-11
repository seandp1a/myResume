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

  constructor(public activeModal: NgbActiveModal,private userSvc:UserService) { }

  public doDelete(modal){
    this.userSvc.deleteUser(this.id.toString(),this.token).subscribe((res)=>{
      console.log(res)
    })
    modal.close();
  }
  ngOnInit(): void {
    console.log(this.id);
  }

}
