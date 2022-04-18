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
import { PublicCard } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  setGameStoppedHandler: () => void;
  setDeckHandler: (deck: PublicCard[]) => void;
  setCardContentHandler: (cardId: number, content: string) => void;
  setCardDiscoveredHandler: (cardId: number) => void;
  nextTurnHandler: (myTurn: boolean) => void;
}

let socket: Socket;

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
  })
    .on(ClientMessage.GameStopped, () => setGameStoppedHandler())
    .on(ClientMessage.Deck, (msg: DeckMessage) => {
      setDeckHandler(msg.deck);
    })
    .on(ClientMessage.NextTurn, ({ myTurn }: NextTurnMessage) => {
      nextTurnHandler(myTurn);
    })
    .on(ClientMessage.CardReveal, ({ cardId, content }: CardRevealMessage) => {
      setCardContentHandler(cardId, content);
    })
    .on(ClientMessage.CardsDiscovered, ({ cardIds }: CardsDiscoveredMessage) => {
      cardIds.forEach((cardId) => setCardDiscoveredHandler(cardId));
    });

  const joinMessage: JoinMessage = {
    table: window.location.pathname.split('/')[1],
  };
  socket.emit(ServerMessage.Join, joinMessage, (success: boolean) => {
    if (!success) {
      window.alert('Game already started');
    }
  });
};

export const revealCard = (card: PublicCard) => {
  const revealCardMessage: RequestRevealMessage = {
    cardId: card.cardId,
  };
  socket.emit(ServerMessage.Reveal, revealCardMessage);
};

export const startGame = () => {
  socket.emit(ServerMessage.Start);
};
