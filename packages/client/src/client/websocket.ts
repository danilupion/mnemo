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
import { PublicCard } from '@mnemo/common/models/card';
import { Socket, io } from 'socket.io-client';

interface WebsocketParams {
  setDeckHandler: (deck: PublicCard[]) => void;
  setCardContentHandler: (cardId: number, content: string) => void;
  setCardDiscoveredHandler: (cardId: number) => void;
  nextTurnHandler: () => void;
}

let socket: Socket;

export default ({
  setDeckHandler,
  setCardContentHandler,
  setCardDiscoveredHandler,
  nextTurnHandler,
}: WebsocketParams) => {
  socket = io({
    transports: ['websocket'],
    path: '/websocket',
  })
    .on(ClientMessage.Deck, (msg: DeckMessage) => {
      setDeckHandler(msg.deck);
    })
    .on(ClientMessage.CardReveal, ({ cardId, content }: CardRevealMessage) => {
      setCardContentHandler(cardId, content);
    })
    .on(ClientMessage.CardsDiscovered, ({ cardIds }: CardsDiscoveredMessage) => {
      cardIds.forEach((cardId) => setCardDiscoveredHandler(cardId));
    })
    .on(ClientMessage.NextTurn, () => {
      nextTurnHandler();
    });

  const joinMessage: JoinMessage = {
    table: window.location.pathname.split('/')[1],
  };
  socket.emit(ServerMesage.Join, joinMessage);
};

export const revealCard = (card: PublicCard) => {
  const revealCardMessage: RequestRevealMessage = {
    cardId: card.cardId,
  };
  socket.emit(ServerMesage.Reveal, revealCardMessage);
};
