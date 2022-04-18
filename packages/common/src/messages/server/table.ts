export enum ServerMessage {
  Join = 'join',
  Start = 'start',
  Reveal = 'reveal',
}

export interface JoinMessage {
  table: string;
}

export interface RequestRevealMessage {
  cardId: number;
}
