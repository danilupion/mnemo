import { PublicCard } from '../../models/card';

export const deck = 'deck';

export interface DeckMessage {
  deck: PublicCard[];
}

export const cardReveal = 'cardReveal';

export interface CardRevealMessage {
  cardId: number;
  content: string;
}

export const nextTurn = 'nextTurn';
