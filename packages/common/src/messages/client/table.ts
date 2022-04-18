import { PublicCard } from '../../models/card';

export enum ClientMessage {
  Deck = 'deck',
  CardReveal = 'cardReveal',
  NextTurn = 'nextTurn',
  CardsDiscovered = 'cardsDiscovered',
  GameStopped = 'gameStopped',
}

export interface DeckMessage {
  deck: PublicCard[];
}

export interface CardRevealMessage {
  cardId: number;
  content: string;
}

export interface NextTurnMessage {
  myTurn: boolean;
}

export interface CardsDiscoveredMessage {
  cardIds: number[];
}
