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
import { Card } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  setDeck: (deck: Card[]) => void;
  setCardContent: (cardId: number, content: string) => void;
}

let socket: Socket;

export default ({ setDeck, setCardContent }: WebsocketParams) => {
  socket = io({
    transports: ['websocket'],
    path: '/websocket',
  });

  socket.on(deck, (msg: DeckMessage) => {
    setDeck(msg.deck);
  });

  socket.on(cardReveal, (msg: CardRevealMessage) => {
    setCardContent(msg.cardId, msg.content);
  });

  const joinMessage: JoinMessage = {
    table: 'test',
  };
  socket.emit(join, joinMessage);
};

export const revealCard = (card: Card) => {
  const revealCardMessage: RequestRevealMessage = {
    cardId: card.cardId,
  };
  socket.emit(requestReveal, revealCardMessage);
};
