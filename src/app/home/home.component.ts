import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  showWarn: boolean = false;
  inputText: String;
  send() {
    if (this.inputText) {
      if (this.inputText.trim() === '') {
        this.showWarn = true;
        return;
      }
      alert('後端還沒架起來，是要送去哪：）');
      this.showWarn = false;
      return;
    }
    this.showWarn = true;
  }

  ngOnInit(): void {

  }

}
