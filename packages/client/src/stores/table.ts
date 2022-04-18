import { CardId, PublicCard } from '@mnemo/common/models/card';
import { makeAutoObservable } from 'mobx';

class Card {
  public cardId: CardId;
  public content: string | null;
  public discovered: boolean;

  constructor(card: PublicCard) {
    this.cardId = card.cardId;
    this.content = card.content;
    this.discovered = card.discovered;

    makeAutoObservable(this);
  }

  setContent(content: string | null) {
    this.content = content;
  }

  setDiscovered() {
    this.discovered = true;
  }
}

export class TableStore {
  private cards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public setDeck = (deck: PublicCard[]) => {
    this.cards = deck.map((card) => new Card(card));
  };

  public setCardContent = (cardId: CardId, content: string) => {
    const card = this.cards.find((c) => c.cardId === cardId);
    if (card) {
      card.setContent(content);
    }
  };

  public setCardDiscovered = (cardId: CardId) => {
    const card = this.cards.find((c) => c.cardId === cardId);
    if (card) {
      card.setDiscovered();
    }
  };

  public clearCardsContent = () => {
    this.cards.forEach((card) => card.setContent(null));
  };

  public get deck(): Card[] {
    return this.cards;
  }
}

export default new TableStore();
