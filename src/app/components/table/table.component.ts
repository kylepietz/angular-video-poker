import { Component, OnInit } from '@angular/core';
import { DeckComponent } from '../deck/deck.component';

//importing models
import { Hand } from '../../models/Hand';
import { Deck } from '../../models/Deck';
import { Card } from '../../models/Card';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  static startingAmount: number = 100;
  currentAmount: number;
  betAmount: number = 10;
  deckComponent: DeckComponent = new DeckComponent();
  hand: Hand = {
    cards: [],
    result: '',
  }
  firstGame: boolean = true;
  showBet: boolean = true;
  showCards: boolean = false;
  showResult: boolean = false;
  cashOut: boolean = false;

  //error message flags
  showBetAmountError: boolean = false;

  constructor() { }

  ngOnInit() {
    this.currentAmount = TableComponent.startingAmount;
    this.betScreen();
  }

  betScreen() {
    this.showBet = true;
    this.cashOut, this.showCards, this.showResult = false;
  }

  startGame() {
    if(this.betAmount >= 1 && this.betAmount <= this.currentAmount) {
      this.showBetAmountError = false;
      this.hand = {
        cards: [], result: '',
      }
      this.deckComponent = new DeckComponent();
      this.currentAmount -= this.betAmount;
      this.drawFromDeck(5);
      this.firstGame = false;
      this.showBet = false;
      this.showCards = true;
    } else {
      this.showBetAmountError = true;
      this.betAmount = 10;
    }
  }

  drawFromDeck(amount: number) {
    for(let i = 0; i < amount; i++) {
      let drawnCard: Card = this.deckComponent.deck.cards.splice(i, 1)[0];
      this.hand.cards.push(drawnCard);
    }
  }

  getImgLocation(suit: string) {
    return 'assets/suit_images/'+suit+'.jpeg';
  }

  swapCards() {
    let removeIndicies: number[] = [];
    for(let i: number = 0; i < this.hand.cards.length; i++) {
      if (this.hand.cards[i].hold === false) {
        removeIndicies.push(i);
      }
    }
    let newCardCount: number = removeIndicies.length;
    for (let i = removeIndicies.length -1; i >= 0; i--) {
      this.hand.cards.splice(removeIndicies[i], 1);
    }
    this.drawFromDeck(newCardCount);
    this.checkHand();
    this.showResult = true;
  }

  checkHand() {
    let handStrings: string[] = ['Royal Flush!', 'Straight Flush!', 'Four of a Kind!', 'Full House!', 'Flush!', 'Straight!', 'Three of a Kind!', 'Two Pair!', 'Jacks or Better!'];
    let multipliers: number[] = [250, 50, 25, 9, 6, 4, 3, 2, 1];
    let handSuits: string[] = [];
    let handRanks: string[] = [];
    let royalFlush, straightFlush, fourOfAKind, fullHouse, flush, straight, threeOfAKind, twoPair, jacksOrBetter = false;
    DeckComponent.rankArray.push('A');
    let modifiedRankArray: string[] = DeckComponent.rankArray;
    //making hand easier to check
    for(let card of this.hand.cards) {
      handSuits.push(card.suit);
      handRanks.push(card.rank);
    }

    let handSuitsSet: Set<string> = new Set(handSuits);
    let distinctSuits = Array.from(handSuitsSet);
    if(distinctSuits.length === 1) {
      flush = true;
    }

    let handRanksSet: Set<string> = new Set(handRanks);
    for(let i: number = 0; i < 10; i++) {
      let thisSet: Set<string> = new Set(modifiedRankArray.slice(i, i + 5));
      if (eqSet(thisSet, handRanksSet)) {
        straight = true;
        break;
      }
    }

    if(flush === true && straight === true) {
      straightFlush = true;
    }

    if(straightFlush === true && handRanks === DeckComponent.rankArray.slice(DeckComponent.rankArray.length - 5, DeckComponent.rankArray.length)) {
      royalFlush = true;
    }

    let sortedRanks: string[] = handRanks.sort()
    let tupArray: [string, number][] = [];
    let thisTup: [string, number];
    let currentCount: number = 0;
    for(let i: number = 0; i < sortedRanks.length; i++) {
      if(i === 0) {
        thisTup = [sortedRanks[i], 1];
      } else if(sortedRanks[i] != sortedRanks[i-1]) {
        tupArray.push(thisTup);
        thisTup = [sortedRanks[i], 1];
      } else {
        thisTup[1] += 1;
      }
      if(i === sortedRanks.length - 1) {
        tupArray.push(thisTup);
      }
    }

    let twoCount: number = 0;
    let threeCount: number = 0;
    for(let i of tupArray) {
      if(i[1] === 2) {
        twoCount += 1;
        if(modifiedRankArray.slice(modifiedRankArray.length - 4, modifiedRankArray.length).indexOf(i[0]) != -1) {
          jacksOrBetter = true;
        }
      }
      if(i[1] === 3) {
        threeCount += 1;
        threeOfAKind = true;
      }
      if(i[1] === 4) {
        fourOfAKind = true;
      }
    }

    if(twoCount === 2) {
      twoPair = true;
    }
    if(twoCount === 1 && threeCount === 1) {
      fullHouse = true;
    }

    let handBools: boolean[] = [royalFlush, straightFlush, fourOfAKind, fullHouse, flush, straight, threeOfAKind, twoPair, jacksOrBetter];
    let outcome: string = 'Better luck next time...';
    let currentMultiplier: number = 0;
    for(let i: number = 0; i < handBools.length; i++) {
      if(handBools[i] === true) {
        outcome = handStrings[i];
        currentMultiplier = multipliers[i];
        break;
      }
    }
    this.hand.result = outcome;
    this.currentAmount += this.betAmount * currentMultiplier;
    this.showCards = false;

    for(let card of this.hand.cards) {
      card.hold = false;
    }
    DeckComponent.rankArray.splice(DeckComponent.rankArray.length-1, 1);
  }

  leaveTable() {
    this.cashOut = true;
    this.showBet, this.showCards, this.showResult = false;
    //TODO: implement a high score system that stores the score in local storage if it is top 5
  }

}

//set equality helper function
function eqSet(set1, set2) {
  return set1.size === set2.size && Array.from(set1).every(function (item) {
    return set2.has(item);
  });
}
