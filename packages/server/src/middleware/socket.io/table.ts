import {
  CardRevealMessage,
  CardsDiscoveredMessage,
  ClientMessage,
  DeckMessage,
  NextTurnMessage,
} from '@mnemo/common/messages/client/table';
import {
  JoinMessage,
  RequestRevealMessage,
  ServerMessage,
} from '@mnemo/common/messages/server/table';
import { PrivateCard, PublicCard } from '@mnemo/common/models/card';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

import MemoryGame, { MemoryGameEvent } from '../../helpers/memoryGame';

const games = new Map<string, { game: MemoryGame; clients: Socket[] }>();

const connectionMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  socket.on(ServerMessage.Join, ({ table }: JoinMessage, ack) => {
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
        const deckMessage: DeckMessage = {
          deck: cards,
        };
        socket.emit(ClientMessage.Deck, deckMessage);
      })
      .on(MemoryGameEvent.CardSelected, (card: PrivateCard) => {
        const cardRevealMessage: CardRevealMessage = {
          ...card,
        };
        socket.emit(ClientMessage.CardReveal, cardRevealMessage);
      })
      .on(MemoryGameEvent.NewTurn, (playerId: string) => {
        const nextTurnMessage: NextTurnMessage = {
          myTurn: playerId === socket.id,
        };
        socket.emit(ClientMessage.NextTurn, nextTurnMessage);
      })
      .on(MemoryGameEvent.CardsDiscovered, (cardIds: number[]) => {
        const cardsDiscoveredMessage: CardsDiscoveredMessage = {
          cardIds,
        };
        socket.emit(ClientMessage.CardsDiscovered, cardsDiscoveredMessage);
      })
      .on(MemoryGameEvent.GameEnded, () => {
        socket.emit(ClientMessage.GameStopped);
      });

    socket
      .on(ServerMessage.Start, () => {
        game.start();
      })
      .on(ServerMessage.Reveal, ({ cardId }: RequestRevealMessage) => {
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

export default connectionMiddleware;
