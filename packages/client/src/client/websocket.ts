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
import { PublicCard } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  setDeckHandler: (deck: PublicCard[]) => void;
  setCardContentHandler: (cardId: number, content: string) => void;
  nextTurnHandler: () => void;
}

let socket: Socket;

export default ({ setDeckHandler, setCardContentHandler, nextTurnHandler }: WebsocketParams) => {
  socket = io({
    transports: ['websocket'],
    path: '/websocket',
  });

  socket.on(deck, (msg: DeckMessage) => {
    setDeckHandler(msg.deck);
  });

  socket.on(cardReveal, (msg: CardRevealMessage) => {
    setCardContentHandler(msg.cardId, msg.content);
  });

  socket.on(nextTurn, () => {
    nextTurnHandler();
  });

  const joinMessage: JoinMessage = {
    table: window.location.pathname.split('/')[1],
  };
  socket.emit(join, joinMessage);
};

export const revealCard = (card: PublicCard) => {
  const revealCardMessage: RequestRevealMessage = {
    cardId: card.cardId,
  };
  socket.emit(requestReveal, revealCardMessage);
};
