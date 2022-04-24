import {
  ClientToServerRoomEvent,
  ClientToServerRoomEvents,
  ServerToClientRoomEvent,
  ServerToClientRoomEvents,
} from '@mnemo/common/events/room';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import { Room, RoomEvent } from '../../room/room';

const rooms = new Map<string, Room>();

const roomMiddleware = (
  socket: Socket<ClientToServerRoomEvents, ServerToClientRoomEvents>,
  next: (err?: ExtendedError) => void,
) => {
  socket.on(ClientToServerRoomEvent.Join, (roomName, ack) => {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Room());
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const room = rooms.get(roomName)!;

    room.addSocket(socket);
    socket.join(roomName);

    room.on(RoomEvent.UserLeft, () => {
      socket.emit(ServerToClientRoomEvent.UserLeft);
    });

    room.on(RoomEvent.UserJoined, () => {
      socket.emit(ServerToClientRoomEvent.UserJoined);
    });

    ack(true);
  });
  next();
};

export default roomMiddleware;
