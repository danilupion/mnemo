import { Card as CardModel } from '@mnemo/common/models/card';
import { makeAutoObservable } from 'mobx';

class Card {
  public cardId: number;
  public content: string | null;

  constructor(card: CardModel) {
    this.cardId = card.cardId;
    this.content = card.content;

    makeAutoObservable(this);
  }

  setContent(content: string) {
    this.content = content;
  }
}

export class TableStore {
  private cards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public setDeck = (deck: CardModel[]) => {
    this.cards = deck.map((card) => new Card(card));
  };

  public setCardContent = (cardId: number, content: string) => {
    const card = this.cards.find((c) => c.cardId === cardId);
    if (card) {
      card.setContent(content);
    }
  };

  public get deck(): Card[] {
    return this.cards;
  }
}

export default new TableStore();
