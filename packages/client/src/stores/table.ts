import { PlayerScore } from '@mnemo/common/events/table';
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
  private _cards: Card[] = [];
  private _isMyTurn = false;
  private _isGameRunning = false;
  private _currentPlayer?: string;
  private _ranking: PlayerScore[] = [];

  constructor() {
    makeAutoObservable(this);
  }

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

  public set cards(deck: PublicCard[]) {
    this._cards = deck.map((card) => new Card(card));
  }

  public get cards(): Card[] {
    return this._cards;
  }

  public set isMyTurn(myTurn: boolean) {
    this._isMyTurn = myTurn;
  }

  public get isMyTurn() {
    return this._isMyTurn;
  }

  public set isGameRunning(gameRunning: boolean) {
    this._isGameRunning = gameRunning;
  }

  public get isGameRunning() {
    return this._isGameRunning;
  }

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public set currentPlayer(player: string | undefined) {
    this._currentPlayer = player;
  }

  public set ranking(ranking: PlayerScore[]) {
    this._ranking = ranking;
  }

  public get ranking() {
    return this._ranking.slice().sort((a, b) => b.score - a.score);
  }
}

export default new TableStore();
