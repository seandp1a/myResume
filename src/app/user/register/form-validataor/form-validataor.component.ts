import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-validataor',
  templateUrl: './form-validataor.component.html',
  styleUrls: ['./form-validataor.component.css']
})
export class FormValidataorComponent implements OnInit {

  constructor() { }
  @Input() errorMsg;

  ngOnInit(): void {
    console.log(this.errorMsg)
  }

}
