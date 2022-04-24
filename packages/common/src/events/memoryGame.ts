import { PublicCard } from '../models/card';

export enum ServerToClientMemoryGameEvent {
  GameStart = 'memoryGame::start',
  CardRevealed = 'memoryGame::cardRevealed',
  NextTurn = 'memoryGame::nextTurn',
  CardDiscovered = 'memoryGame::cardDiscovered',
  GameEnd = 'memoryGame::gameEnd',
}

export interface PlayerScore {
  playerName: string;
  score: number;
}

export interface ServerToClientMemoryGameEvents {
  [ServerToClientMemoryGameEvent.GameStart]: (deck: PublicCard[], scores: PlayerScore[]) => void;
  [ServerToClientMemoryGameEvent.CardRevealed]: (cardId: number, content: string) => void;
  [ServerToClientMemoryGameEvent.NextTurn]: (playerName: string, myTurn: boolean) => void;
  [ServerToClientMemoryGameEvent.CardDiscovered]: (cards: number[], scores: PlayerScore[]) => void;
  [ServerToClientMemoryGameEvent.GameEnd]: () => void;
}

export enum ClientToServerMemoryGameEvent {
  Start = 'memoryGame::start',
  Reveal = 'memoryGame::reveal',
}

export interface ClientToServerMemoryGameEvents {
  [ClientToServerMemoryGameEvent.Start]: () => void;
  [ClientToServerMemoryGameEvent.Reveal]: (cardId: number) => void;
}
