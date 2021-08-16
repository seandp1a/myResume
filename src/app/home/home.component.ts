import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEventDirection, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() { }
  showWarn: boolean = false;
  inputText: String;
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  send() {
    if (this.inputText) {
      this.showWarn = false;
      if (this.inputText.trim() === '') {
        this.showWarn = true;
        return;
      }
      alert('後端還沒架起來，是要送去哪：）');
      return;
    }
    this.showWarn = true;
  }

  ngOnInit(): void {
  }

}
