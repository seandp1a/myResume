import { UserRoutingModule } from './user-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,UserRoutingModule,FormsModule
  ]
})
export class UserModule { }
