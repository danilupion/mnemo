import {
  CardRevealMessage,
  CardsDiscoveredMessage,
  ClientMessage,
  DeckMessage,
} from '@mnemo/common/messages/client/table';
import {
  JoinMessage,
  RequestRevealMessage,
  ServerMesage,
} from '@mnemo/common/messages/server/table';
import { PrivateCard } from '@mnemo/common/models/card';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame, { MemoryGameEvent } from '../../helpers/memoryGame';

const games = new Map<string, { game: MemoryGame; clients: Socket[] }>();

const connectionMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  socket.on(ServerMesage.Join, ({ table }: JoinMessage) => {
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
    socket.emit(ClientMessage.Deck, deckMessage);

    game
      .on(MemoryGameEvent.CardSelected, (card: PrivateCard) => {
        const cardRevealMessage: CardRevealMessage = {
          ...card,
        };
        socket.emit(ClientMessage.CardReveal, cardRevealMessage);
      })
      .on(MemoryGameEvent.NewTurn, () => {
        socket.emit(ClientMessage.NextTurn);
      })
      .on(MemoryGameEvent.CardsDiscovered, (cardIds: number[]) => {
        const cardsDiscoveredMessage: CardsDiscoveredMessage = {
          cardIds,
        };
        socket.emit(ClientMessage.CardsDiscovered, cardsDiscoveredMessage);
      });

    socket
      .on(ServerMesage.Reveal, ({ cardId }: RequestRevealMessage) => {
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
