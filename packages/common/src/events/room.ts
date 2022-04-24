export enum ClientToServerRoomEvent {
  Join = 'room::join',
}

export interface ClientToServerRoomEvents {
  [ClientToServerRoomEvent.Join]: (table: string, ack: (success: boolean) => void) => void;
}

export enum ServerToClientRoomEvent {
  UserJoined = 'room::userJoined',
  UserLeft = 'room::userLeft',
}

export interface ServerToClientRoomEvents {
  [ServerToClientRoomEvent.UserJoined]: () => void;
  [ServerToClientRoomEvent.UserLeft]: () => void;
}
