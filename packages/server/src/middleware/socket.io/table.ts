import {
  CardRevealMessage,
  DeckMessage,
  cardReveal,
  deck,
  nextTurn,
} from '@mnemo/common/messages/client/table';
import {
  JoinMessage,
  RequestRevealMessage,
  join,
  requestReveal,
} from '@mnemo/common/messages/server/table';
import { PrivateCard } from '@mnemo/common/models/card';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame, { MemoryGameEvent } from '../../helpers/memoryGame';

const games = new Map<string, { game: MemoryGame; clients: Socket[] }>();

const connectionMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  socket.on(join, ({ table }: JoinMessage) => {
    if (!games.has(table)) {
      games.set(table, { game: new MemoryGame(), clients: [socket] });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { game, clients } = games.get(table)!;
    if (!clients.find((c) => c.id === socket.id)) {
      clients.push(socket);
    }

    if (!game.addPlayer(socket.id)) {
      // TODO: handle game already started
      return;
    }
    socket.join(table);

    const deckMessage: DeckMessage = {
      deck: game.boardCards,
    };
    socket.emit(deck, deckMessage);

    game
      .on(MemoryGameEvent.CardSelected, (card: PrivateCard) => {
        const cardRevealMessage: CardRevealMessage = {
          ...card,
        };
        socket.emit(cardReveal, cardRevealMessage);
      })
      .on(MemoryGameEvent.NewTurn, () => {
        socket.emit(nextTurn);
      });

    socket
      .on(requestReveal, ({ cardId }: RequestRevealMessage) => {
        if (socket.id === game.getCurrentPlayer()) {
          game.selectCard(cardId);
        }
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

export default connectionMiddleware;
