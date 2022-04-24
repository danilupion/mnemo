import {
  ClientToServerMemoryGameEvent,
  ClientToServerMemoryGameEvents,
  ServerToClientMemoryGameEvent,
  ServerToClientMemoryGameEvents,
} from '@mnemo/common/events/memoryGame';
import { ClientToServerRoomEvent, ClientToServerRoomEvents } from '@mnemo/common/events/room';
import { PrivateCard, PublicCard } from '@mnemo/common/models/card';
import { PlayerId } from '@mnemo/common/models/player';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame, { MemoryGameEvent, Player } from '../../games/memoryGame';
import { Room, RoomEvent } from '../../room/room';

const memoryGameMiddleware = (
  socket: Socket<
    ClientToServerMemoryGameEvents & ClientToServerRoomEvents,
    ServerToClientMemoryGameEvents
  >,
  next: (err?: ExtendedError) => void,
) => {
  socket.on(ClientToServerRoomEvent.Join, () => {
    const room = socket.data.room as Room;
    if (!room.data) {
      const game = new MemoryGame();
      socket.data.room.data = game;

      room.sockets.forEach((s) => {
        game.addPlayer(s.id);
      });

      room.on(RoomEvent.UserLeft, (socket: Socket) => {
        game.removePlayer(socket.id);
      });

      room.on(RoomEvent.UserJoined, (socket: Socket) => {
        game.addPlayer(socket.id);
      });
    }

    const game = socket.data.room.data as MemoryGame;

    const getPlayerName = (id: PlayerId) => {
      const socket = room.sockets.find((c) => c.id === id);
      return socket ? socket.data.name : '';
    };

    game
      .on(MemoryGameEvent.GameStart, (cards: PublicCard[], players: Player[]) => {
        socket.emit(
          ServerToClientMemoryGameEvent.GameStart,
          cards,
          players.map((p) => ({ playerName: getPlayerName(p.id), score: p.score })),
        );
      })
      .on(MemoryGameEvent.CardSelection, ({ cardId, content }: PrivateCard) => {
        socket.emit(ServerToClientMemoryGameEvent.CardRevealed, cardId, content);
      })
      .on(MemoryGameEvent.NewTurn, (playerId: PlayerId) => {
        socket.emit(
          ServerToClientMemoryGameEvent.NextTurn,
          getPlayerName(playerId),
          playerId === socket.id,
        );
      })
      .on(MemoryGameEvent.CardsDiscovery, (cardIds: number[], players: Player[]) => {
        socket.emit(
          ServerToClientMemoryGameEvent.CardDiscovered,
          cardIds,
          players.map((p) => ({ playerName: getPlayerName(p.id), score: p.score })),
        );
      })
      .on(MemoryGameEvent.GameEnd, () => {
        socket.emit(ServerToClientMemoryGameEvent.GameEnd);
      });

    socket
      .on(ClientToServerMemoryGameEvent.Start, () => {
        game.start();
      })
      .on(ClientToServerMemoryGameEvent.Reveal, (cardId) => {
        game.selectCard(socket.id, cardId);
      });
  });

  next();
};

export default memoryGameMiddleware;
