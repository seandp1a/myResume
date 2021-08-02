import { UserRoutingModule } from './user-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { FormValidataorComponent } from './register/form-validataor/form-validataor.component';



@NgModule({
  declarations: [UserListComponent, RegisterComponent, FormValidataorComponent],
  imports: [
    CommonModule,UserRoutingModule,FormsModule,ReactiveFormsModule
  ]
})
export class UserModule { }
