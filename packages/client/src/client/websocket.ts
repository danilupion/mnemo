import {
  ClientToServerTableEvent,
  ClientToServerTableEvents,
  PlayerScore,
  ServerToClientTableEvent,
  ServerToClientTableEvents,
} from '@mnemo/common/events/table';
import { PublicCard } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  name: string;
  gameEndHandler: () => void;
  gameStartHandler: (deck: PublicCard[], scores: PlayerScore[]) => void;
  setCardContentHandler: (cardId: number, content: string) => void;
  cardDiscoveredHandler: (cardIds: number[], scores: PlayerScore[]) => void;
  nextTurnHandler: (player: string, myTurn: boolean) => void;
}

let socket: Socket<ServerToClientTableEvents, ClientToServerTableEvents>;

export default ({
  name,
  gameEndHandler,
  gameStartHandler,
  setCardContentHandler,
  cardDiscoveredHandler,
  nextTurnHandler,
}: WebsocketParams) => {
  socket = io({
    transports: ['websocket'],
    path: '/websocket',
    query: {
      name,
    },
  });

  socket
    .on(ServerToClientTableEvent.GameEnd, gameEndHandler)
    .on(ServerToClientTableEvent.GameStart, gameStartHandler)
    .on(ServerToClientTableEvent.NextTurn, nextTurnHandler)
    .on(ServerToClientTableEvent.CardRevealed, setCardContentHandler)
    .on(ServerToClientTableEvent.CardDiscovered, cardDiscoveredHandler);

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
