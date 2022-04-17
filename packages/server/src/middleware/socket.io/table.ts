import {
  CardRevealMessage,
  DeckMessage,
  cardReveal,
  deck,
} from '@mnemo/common/messages/client/table';
import {
  JoinMessage,
  RequestRevealMessage,
  join,
  requestReveal,
} from '@mnemo/common/messages/server/table';
import { Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame from '../../helpers/memoryGame';

const games = new Map<string, { game: MemoryGame; clients: Socket[] }>();

const connectionMiddleware =
  (io: Server) => (socket: Socket, next: (err?: ExtendedError) => void) => {
    socket.on(join, ({ table }: JoinMessage) => {
      if (!games.has(table)) {
        games.set(table, { game: new MemoryGame(), clients: [socket] });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { game, clients } = games.get(table)!;
      if (!clients.find((c) => c.id === socket.id)) {
        clients.push(socket);
      }
      socket.join(table);

      const deckMessage: DeckMessage = {
        deck: game.boardCards,
      };
      socket.emit(deck, deckMessage);

      socket.on(requestReveal, ({ cardId }: RequestRevealMessage) => {
        const card = game.getCardById(cardId);

        if (card) {
          const cardRevealMessage: CardRevealMessage = {
            cardId: card.cardId,
            content: card.content,
          };
          io.to(table).emit(cardReveal, cardRevealMessage);
        }
      });

      socket.on('disconnect', () => {
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

export default connectionMiddleware;
