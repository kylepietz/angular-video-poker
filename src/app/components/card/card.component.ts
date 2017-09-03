import { Component, OnInit } from '@angular/core';

//import models
import { Card } from '../../models/Card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  cardInfo: Card;

  constructor(rank: string, suit: string) {
    this.cardInfo.rank = rank;
    this.cardInfo.suit = suit;
  }

  ngOnInit() {
  }

}
