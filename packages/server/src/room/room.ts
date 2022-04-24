import { Socket } from 'socket.io/dist/socket';

import { SafeTypeEmitter } from '../utils/safeTypeEmitter';

export enum RoomEvent {
  UserJoined = 'game:userJoined',
  UserLeft = 'game:userLeft',
}

interface RoomEvents {
  [RoomEvent.UserJoined]: (socket: Socket) => void;
  [RoomEvent.UserLeft]: (socket: Socket) => void;
}

export class Room extends SafeTypeEmitter<RoomEvents> {
  private _sockets: Socket[] = [];
  public data: any;

  public addSocket(socket: Socket) {
    if (!this._sockets.find((c) => c.id === socket.id)) {
      socket.data.room = this;
      this._sockets.push(socket);
      socket.on('disconnect', () => {
        this.removeSocket(socket);
      });
      setImmediate(() => {
        this.emit(RoomEvent.UserJoined, socket);
      });
    }
  }

  public removeSocket(socket: Socket) {
    const index = this._sockets.findIndex((c) => c.id === socket.id);
    if (index !== -1) {
      const socket = this._sockets.splice(index, 1)[0];
      this.emit(RoomEvent.UserLeft, socket);
    }
  }

  public get sockets() {
    return [...this._sockets];
  }
}
