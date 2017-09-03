import { Component, OnInit } from '@angular/core';
//import { CardComponent } from '../card/card.component';

//import models
import { Deck } from '../../models/Deck';
import { Card } from '../../models/Card';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {
  static rankArray: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  static suitArray: string[] = ['clubs', 'hearts', 'diamonds', 'spades'];
  deck: Deck = {cards: []};

  constructor() {
    this.makeDeck();
    console.log('deckcomp constructor')
  }

  ngOnInit() {

  }

  makeDeck() {
    for(let r of DeckComponent.rankArray) {
      for(let s of DeckComponent.suitArray) {
        //let newCard = new CardComponent(r, s);
        //this.deck.cards.push(newCard.cardInfo);
        let currentCard: Card = {
          rank: r,
          suit: s,
          hold: false,
        }
        this.deck.cards.push(currentCard);
      }
    }
    this.shuffleDeck(this.deck.cards);
  }

  shuffleDeck(cards: Card[]) {
    let j, x, i;
    for (i = cards.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = cards[i - 1];
      cards[i - 1] = cards[j];
      cards[j] = x;
    }
  }

}
