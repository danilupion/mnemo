import { PublicCard } from '../models/card';

export enum ServerToClientTableEvent {
  Deck = 'table::deck',
  CardRevealed = 'table::cardRevealed',
  NextTurn = 'table::nextTurn',
  CardDiscovered = 'table::cardDiscovered',
  GameStopped = 'table::gameStopped',
}

export interface ServerToClientTableEvents {
  [ServerToClientTableEvent.Deck]: (deck: PublicCard[]) => void;
  [ServerToClientTableEvent.CardRevealed]: (cardId: number, content: string) => void;
  [ServerToClientTableEvent.NextTurn]: (myTurn: boolean) => void;
  [ServerToClientTableEvent.CardDiscovered]: (cards: number[]) => void;
  [ServerToClientTableEvent.GameStopped]: () => void;
}

export enum ClientToServerTableEvent {
  Join = 'table::join',
  Start = 'table::start',
  Reveal = 'table::reveal',
}

export interface ClientToServerTableEvents {
  [ClientToServerTableEvent.Join]: (table: string, ack: (success: boolean) => void) => void;
  [ClientToServerTableEvent.Start]: () => void;
  [ClientToServerTableEvent.Reveal]: (cardId: number) => void;
}
