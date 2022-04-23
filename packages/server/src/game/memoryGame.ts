import { EventEmitter } from 'events';

import { CardId, PrivateCard, PublicCard } from '@mnemo/common/models/card';
import { PlayerId } from '@mnemo/common/models/player';
import { randomItem, shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';
import config from 'config';

export interface Player {
  id: string;
  score: number;
}

export enum MemoryGameEvent {
  GameStart = 'gmeStart',
  CardSelection = 'cardSelection',
  NewTurn = 'newTurn',
  CardsDiscovery = 'cardsDiscovery',
  GameEnd = 'gameEnd',
}

interface MemoryGameEvents {
  [MemoryGameEvent.GameStart]: (cards: PublicCard[], score: Player[]) => void;
  [MemoryGameEvent.CardSelection]: (card: PublicCard) => void;
  [MemoryGameEvent.NewTurn]: (playerId: PlayerId) => void;
  [MemoryGameEvent.CardsDiscovery]: (cards: CardId[], score: Player[]) => void;
  [MemoryGameEvent.GameEnd]: () => void;
}

const turnChangeDelay = 2000;
const numberOfCards = config.get<number>('game.numberOfCards');

const publicCardFactory = (card: PrivateCard, preserveValue = false): PublicCard => ({
  ...card,
  content: preserveValue ? card.content : null,
});

class MemoryGame {
  private cards: PrivateCard[] = [];
  private players: Player[] = [];
  private running = false;
  private emitter = new EventEmitter();
  private currentPlayer: Player | undefined = undefined;
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
      if (this.players.find((player) => player.id === playerId) === undefined) {
        this.players.push({ id: playerId, score: 0 });
      }

      return true;
    }

    return false;
  }

  public removePlayer(playerId: PlayerId) {
    if (this.running) {
      // TODO: cleanup
    }
    this.players = this.players.filter((player) => player.id !== playerId);
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

    this.emit(MemoryGameEvent.NewTurn, this.currentPlayer.id);
  }

  private handleSelection() {
    if (this.selectedCards.length !== 2) {
      return;
    }

    if (this.selectedCards[0].content === this.selectedCards[1].content) {
      this.selectedCards.forEach((card) => {
        card.discovered = true;
      });

      if (this.currentPlayer) {
        this.currentPlayer.score += 1;
      }
      this.emit(
        MemoryGameEvent.CardsDiscovery,
        [this.selectedCards[0].cardId, this.selectedCards[1].cardId],
        [...this.players],
      );

      if (this.cards.every((c) => c.discovered)) {
        this.currentPlayer = undefined;
        this.players.forEach((player) => {
          player.score = 0;
        });
        this.selectedCards = [];
        this.running = false;
        this.emit(MemoryGameEvent.GameEnd);
      } else {
        this.nextTurn(false);
      }
    } else {
      this.nextTurn(true);
    }
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
      this.emit(MemoryGameEvent.GameStart, this.boardCards, [...this.players]);
      this.nextTurn(true);
    }
  }

  public selectCard(playerId: PlayerId, cardId: CardId) {
    if (this.currentPlayer && playerId !== this.currentPlayer.id) {
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
      this.emit(MemoryGameEvent.CardSelection, publicCardFactory(card, true));

      if (this.selectedCards.length === 2) {
        setTimeout(() => {
          this.handleSelection();
        }, turnChangeDelay);
      }
    }
  }
}

export default MemoryGame;
