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
import { shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';
import { Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';

const cards = shuffle(
  emojis[EmojiType.AnimalsAndNature].map((emoji, index) => ({ cardId: index, content: emoji })),
);

const defaultRoom = 'default';

const connectionMiddleware =
  (io: Server) => (socket: Socket, next: (err?: ExtendedError) => void) => {
    socket.on(join, (msg: JoinMessage) => {
      console.log(`Joined at table ${msg.table}`);
      socket.join(defaultRoom);

      const deckMessage: DeckMessage = {
        deck: cards.map((c) => ({ ...c, content: null })),
      };
      socket.emit(deck, deckMessage);
    });

    socket.on(requestReveal, (msg: RequestRevealMessage) => {
      const cardRevealMessage: CardRevealMessage = {
        cardId: msg.cardId,
        content: cards[msg.cardId].content,
      };
      io.to(defaultRoom).emit(cardReveal, cardRevealMessage);
    });

    next();
  };

export default connectionMiddleware;
