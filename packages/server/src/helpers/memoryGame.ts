import { EventEmitter } from 'events';

import { PrivateCard } from '@mnemo/common/models/card';
import { shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';

export enum MemoryGameEvent {
  CardSelected = 'cardSelected',
  NewTurn = 'newTurn',
}

const turnChangeDelay = 2000;

class MemoryGame extends EventEmitter {
  private cards: PrivateCard[];
  private players: string[] = [];
  private running = false;

  private currentPlayer: string | undefined = undefined;
  private selectedCards: PrivateCard[] = [];

  constructor() {
    super();
    this.cards = shuffle(
      emojis[EmojiType.AnimalsAndNature].map((emoji, index) => ({ cardId: index, content: emoji })),
    );
  }

  public addPlayer(playerId: string) {
    if (!this.running) {
      if (this.players.find((player) => player === playerId) === undefined) {
        this.players.push(playerId);

        // TODO: rethink, start should be called by player
        if (this.players.length === 2) {
          this.start();
        }
      }

      return true;
    }

    return false;
  }

  public removePlayer(playerId: string) {
    if (!this.running) {
      this.players = this.players.filter((player) => player !== playerId);
      return true;
    }
    return false;
  }

  public get boardCards() {
    return this.cards.map((c) => ({ ...c, content: null }));
  }

  private getCardById(cardId: number) {
    return this.cards.find((c) => c.cardId === cardId);
  }

  private nextTurn() {
    if (this.currentPlayer === undefined) {
      this.currentPlayer = this.players[0];
    } else {
      this.currentPlayer =
        this.players[(this.players.indexOf(this.currentPlayer) + 1) % this.players.length];
    }
    this.selectedCards = [];

    this.emit(MemoryGameEvent.NewTurn);
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public start() {
    this.running = true;
    this.currentPlayer = this.players[0];
  }

  public selectCard(cardId: number) {
    if (this.selectedCards.length === 2) {
      return;
    }

    if (this.selectedCards.length === 1 && cardId === this.selectedCards[0].cardId) {
      return;
    }

    const card = this.getCardById(cardId);
    if (card) {
      this.selectedCards.push(card);
      this.emit(MemoryGameEvent.CardSelected, card);

      if (this.selectedCards.length === 2) {
        setTimeout(() => {
          this.nextTurn();
        }, turnChangeDelay);
      }
    }
  }
}

export default MemoryGame;
