import { EventEmitter } from 'events';

import { CardId, PrivateCard } from '@mnemo/common/models/card';
import { shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';

export enum MemoryGameEvent {
  CardSelected = 'cardSelected',
  NewTurn = 'newTurn',
  CardsDiscovered = 'cardsDiscovered',
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
    const cards = emojis[EmojiType.AnimalsAndNature].slice(0, 10);
    this.cards = shuffle(
      [...cards, ...cards].map((emoji, index) => ({
        cardId: index,
        content: emoji,
        discovered: false,
      })),
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

  private getCardById(cardId: CardId) {
    return this.cards.find((c) => c.cardId === cardId);
  }

  private nextTurn(changePlayer: boolean) {
    if (this.currentPlayer === undefined) {
      this.currentPlayer = this.players[0];
    } else if (changePlayer) {
      this.currentPlayer =
        this.players[(this.players.indexOf(this.currentPlayer) + 1) % this.players.length];
    }
    this.selectedCards = [];

    this.emit(MemoryGameEvent.NewTurn);
  }

  private handleSelection() {
    if (this.selectedCards.length !== 2) {
      return;
    }

    if (this.selectedCards[0].content === this.selectedCards[1].content) {
      // TODO: add pair to player
      this.emit(MemoryGameEvent.CardsDiscovered, [
        this.selectedCards[0].cardId,
        this.selectedCards[1].cardId,
      ]);
      this.nextTurn(false);
    } else {
      this.nextTurn(true);
    }
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public start() {
    this.running = true;
    this.currentPlayer = this.players[0];
  }

  public selectCard(cardId: CardId) {
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
          this.handleSelection();
        }, turnChangeDelay);
      }
    }
  }
}

export default MemoryGame;
