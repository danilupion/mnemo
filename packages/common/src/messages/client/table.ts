import { PublicCard } from '../../models/card';

export const deck = 'deck';

export interface DeckMessage {
  deck: PublicCard[];
}

export interface CardRevealMessage {
  cardId: number;
  content: string;
}

export const cardReveal = 'cardReveal';
