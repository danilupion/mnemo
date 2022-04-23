import { EventEmitter } from 'events';

import { CardId, PrivateCard, PublicCard } from '@mnemo/common/models/card';
import { PlayerId } from '@mnemo/common/models/player';
import { randomItem, shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';
import config from 'config';

export enum MemoryGameEvent {
  GameStarted = 'gmeStarted',
  CardSelected = 'cardSelected',
  NewTurn = 'newTurn',
  CardsDiscovered = 'cardsDiscovered',
  GameEnded = 'gameEnded',
}

interface MemoryGameEvents {
  [MemoryGameEvent.GameStarted]: (cards: PublicCard[]) => void;
  [MemoryGameEvent.CardSelected]: (card: PublicCard) => void;
  [MemoryGameEvent.NewTurn]: (playerId: PlayerId) => void;
  [MemoryGameEvent.CardsDiscovered]: (cards: CardId[]) => void;
  [MemoryGameEvent.GameEnded]: () => void;
}

const turnChangeDelay = 2000;
const numberOfCards = config.get<number>('game.numberOfCards');

const publicCardFactory = (card: PrivateCard, preserveValue = false): PublicCard => ({
  ...card,
  content: preserveValue ? card.content : null,
});

class MemoryGame {
  private cards: PrivateCard[] = [];
  private players: PlayerId[] = [];
  private running = false;
  private emitter = new EventEmitter();

  private currentPlayer: PlayerId | undefined = undefined;
  private selectedCards: PrivateCard[] = [];

  private emit<E extends keyof MemoryGameEvents>(
    event: E,
    ...args: Parameters<MemoryGameEvents[E]>
  ) {
    return this.emitter.emit(event, ...args);
  }

  public on<E extends keyof MemoryGameEvents>(
    event: E,
    listener: (...args: Parameters<MemoryGameEvents[E]>) => void,
  ) {
    return this.emitter.on(event, listener as (...args: unknown[]) => void);
  }

  public addPlayer(playerId: PlayerId) {
    if (!this.running) {
      if (this.players.find((player) => player === playerId) === undefined) {
        this.players.push(playerId);
      }

      return true;
    }

    return false;
  }

  public removePlayer(playerId: PlayerId) {
    if (!this.running) {
      this.players = this.players.filter((player) => player !== playerId);
      return true;
    }
    return false;
  }

  public get boardCards() {
    return this.cards.map((c) => publicCardFactory(c));
  }

  private getCardById(cardId: CardId) {
    return this.cards.find((c) => c.cardId === cardId);
  }

  private nextTurn(changePlayer: boolean) {
    if (this.currentPlayer === undefined) {
      this.currentPlayer = randomItem(this.players);
    } else if (changePlayer) {
      this.currentPlayer =
        this.players[(this.players.indexOf(this.currentPlayer) + 1) % this.players.length];
    }
    this.selectedCards = [];

    this.emit(MemoryGameEvent.NewTurn, this.currentPlayer);
  }

  private handleSelection() {
    if (this.selectedCards.length !== 2) {
      return;
    }

    if (this.selectedCards[0].content === this.selectedCards[1].content) {
      this.selectedCards.forEach((card) => {
        card.discovered = true;
      });

      // TODO: add score to player
      this.emit(MemoryGameEvent.CardsDiscovered, [
        this.selectedCards[0].cardId,
        this.selectedCards[1].cardId,
      ]);

      if (this.cards.every((c) => c.discovered)) {
        this.currentPlayer = undefined;
        this.selectedCards = [];
        this.running = false;
        this.emit(MemoryGameEvent.GameEnded);
      } else {
        this.nextTurn(false);
      }
    } else {
      this.nextTurn(true);
    }
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public start() {
    if (!this.running) {
      this.running = true;

      const cards = shuffle(emojis[EmojiType.AnimalsAndNature]).slice(0, numberOfCards);
      this.cards = shuffle(
        [...cards, ...cards].map((emoji, index) => ({
          cardId: index,
          content: emoji,
          discovered: false,
        })),
      );
      this.emit(MemoryGameEvent.GameStarted, this.boardCards);
      this.nextTurn(true);
    }
  }

  public selectCard(playerId: PlayerId, cardId: CardId) {
    if (playerId !== this.getCurrentPlayer()) {
      return;
    }

    if (this.selectedCards.length === 2) {
      return;
    }

    if (this.selectedCards.length === 1 && cardId === this.selectedCards[0].cardId) {
      return;
    }

    const card = this.getCardById(cardId);
    if (card) {
      if (card.discovered) {
        return;
      }

      this.selectedCards.push(card);
      this.emit(MemoryGameEvent.CardSelected, publicCardFactory(card, true));

      if (this.selectedCards.length === 2) {
        setTimeout(() => {
          this.handleSelection();
        }, turnChangeDelay);
      }
    }
  }
}

export default MemoryGame;
