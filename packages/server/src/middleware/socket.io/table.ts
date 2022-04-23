import {
  ClientToServerTableEvent,
  ClientToServerTableEvents,
  ServerToClientTableEvent,
  ServerToClientTableEvents,
} from '@mnemo/common/events/table';
import { PrivateCard, PublicCard } from '@mnemo/common/models/card';
import { PlayerId } from '@mnemo/common/models/player';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame, { MemoryGameEvent } from '../../helpers/memoryGame';

const games = new Map<string, { game: MemoryGame; clients: Socket[] }>();

const tableMiddleware = (
  socket: Socket<ClientToServerTableEvents, ServerToClientTableEvents>,
  next: (err?: ExtendedError) => void,
) => {
  socket.on(ClientToServerTableEvent.Join, (table, ack) => {
    if (!games.has(table)) {
      games.set(table, { game: new MemoryGame(), clients: [socket] });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { game, clients } = games.get(table)!;
    if (!clients.find((c) => c.id === socket.id)) {
      clients.push(socket);
    }

    if (!game.addPlayer(socket.id)) {
      ack(false);
      return;
    }
    ack(true);
    socket.join(table);

    game
      .on(MemoryGameEvent.GameStarted, (cards: PublicCard[]) => {
        socket.emit(ServerToClientTableEvent.Deck, cards);
      })
      .on(MemoryGameEvent.CardSelected, ({ cardId, content }: PrivateCard) => {
        socket.emit(ServerToClientTableEvent.CardRevealed, cardId, content);
      })
      .on(MemoryGameEvent.NewTurn, (playerId: PlayerId) => {
        socket.emit(ServerToClientTableEvent.NextTurn, playerId === socket.id);
      })
      .on(MemoryGameEvent.CardsDiscovered, (cardIds: number[]) => {
        socket.emit(ServerToClientTableEvent.CardDiscovered, cardIds);
      })
      .on(MemoryGameEvent.GameEnded, () => {
        socket.emit(ServerToClientTableEvent.GameStopped);
      });

    socket
      .on(ClientToServerTableEvent.Start, () => {
        game.start();
      })
      .on(ClientToServerTableEvent.Reveal, (cardId) => {
        game.selectCard(socket.id, cardId);
      })
      .on('disconnect', () => {
        const index = clients.findIndex((c) => c.id === socket.id);
        if (index !== -1) {
          clients.splice(index, 1);
        }
        if (clients.length === 0) {
          games.delete(table);
        }
      });
  });

  next();
};

export default tableMiddleware;
