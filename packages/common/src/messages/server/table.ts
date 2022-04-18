export enum ServerMesage {
  Join = 'join',
  Reveal = 'reveal',
}

export interface JoinMessage {
  table: string;
}

export interface RequestRevealMessage {
  cardId: number;
}
