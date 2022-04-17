import { Card } from '../../models/card';

export const deck = 'deck';

export interface DeckMessage {
  deck: Card[];
}

export interface CardRevealMessage {
  cardId: number;
  content: string;
}

export const cardReveal = 'cardreveal';
