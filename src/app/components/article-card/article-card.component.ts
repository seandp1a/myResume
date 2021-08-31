import { Component, Input, OnInit } from '@angular/core';
import { ArticleData } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {

  @Input() article: ArticleData;
  public contentPreview: string;
  constructor() { }

  stringToHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };
  ngOnInit(): void {
    this.contentPreview = this.stringToHTML(this.article.content).innerText;
  }
}
