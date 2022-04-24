import {
  ClientToServerMemoryGameEvent,
  ClientToServerMemoryGameEvents,
  PlayerScore,
  ServerToClientMemoryGameEvent,
  ServerToClientMemoryGameEvents,
} from '@mnemo/common/events/memoryGame';
import { ClientToServerRoomEvent, ClientToServerRoomEvents } from '@mnemo/common/events/room';
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

let socket: Socket<
  ServerToClientMemoryGameEvents,
  ClientToServerMemoryGameEvents & ClientToServerRoomEvents
>;

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
    .on(ServerToClientMemoryGameEvent.GameEnd, gameEndHandler)
    .on(ServerToClientMemoryGameEvent.GameStart, gameStartHandler)
    .on(ServerToClientMemoryGameEvent.NextTurn, nextTurnHandler)
    .on(ServerToClientMemoryGameEvent.CardRevealed, setCardContentHandler)
    .on(ServerToClientMemoryGameEvent.CardDiscovered, cardDiscoveredHandler);

  const table = window.location.pathname.split('/')[1];

  socket.emit(ClientToServerRoomEvent.Join, table, (success: boolean) => {
    if (!success) {
      window.alert('Game already started');
    }
  });
};

export const revealCard = (card: PublicCard) => {
  socket.emit(ClientToServerMemoryGameEvent.Reveal, card.cardId);
};

export const startGame = () => {
  socket.emit(ClientToServerMemoryGameEvent.Start);
};
