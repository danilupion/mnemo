import { PublicCard } from '../models/card';

export enum ServerToClientTableEvent {
  GameStart = 'table::start',
  CardRevealed = 'table::cardRevealed',
  NextTurn = 'table::nextTurn',
  CardDiscovered = 'table::cardDiscovered',
  GameEnd = 'table::gameEnd',
}

export interface PlayerScore {
  playerName: string;
  score: number;
}

export interface ServerToClientTableEvents {
  [ServerToClientTableEvent.GameStart]: (deck: PublicCard[], scores: PlayerScore[]) => void;
  [ServerToClientTableEvent.CardRevealed]: (cardId: number, content: string) => void;
  [ServerToClientTableEvent.NextTurn]: (playerName: string, myTurn: boolean) => void;
  [ServerToClientTableEvent.CardDiscovered]: (cards: number[], scores: PlayerScore[]) => void;
  [ServerToClientTableEvent.GameEnd]: () => void;
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
