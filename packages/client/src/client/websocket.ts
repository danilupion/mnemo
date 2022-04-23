import {
  ClientToServerTableEvent,
  ClientToServerTableEvents,
  ServerToClientTableEvent,
  ServerToClientTableEvents,
} from '@mnemo/common/events/table';
import { PublicCard } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  setGameStoppedHandler: () => void;
  setDeckHandler: (deck: PublicCard[]) => void;
  setCardContentHandler: (cardId: number, content: string) => void;
  setCardDiscoveredHandler: (cardId: number) => void;
  nextTurnHandler: (myTurn: boolean) => void;
}

let socket: Socket<ServerToClientTableEvents, ClientToServerTableEvents>;

export default ({
  setGameStoppedHandler,
  setDeckHandler,
  setCardContentHandler,
  setCardDiscoveredHandler,
  nextTurnHandler,
}: WebsocketParams) => {
  socket = io({
    transports: ['websocket'],
    path: '/websocket',
  });

  socket
    .on(ServerToClientTableEvent.GameStopped, () => setGameStoppedHandler())
    .on(ServerToClientTableEvent.Deck, (deck) => {
      setDeckHandler(deck);
    })
    .on(ServerToClientTableEvent.NextTurn, (myTurn) => {
      nextTurnHandler(myTurn);
    })
    .on(ServerToClientTableEvent.CardRevealed, (cardId, content) => {
      setCardContentHandler(cardId, content);
    })
    .on(ServerToClientTableEvent.CardDiscovered, (cardIds) => {
      cardIds.forEach((cardId) => setCardDiscoveredHandler(cardId));
    });

  const table = window.location.pathname.split('/')[1];

  socket.emit(ClientToServerTableEvent.Join, table, (success: boolean) => {
    if (!success) {
      window.alert('Game already started');
    }
  });
};

export const revealCard = (card: PublicCard) => {
  socket.emit(ClientToServerTableEvent.Reveal, card.cardId);
};

export const startGame = () => {
  socket.emit(ClientToServerTableEvent.Start);
};
