import { PrivateCard } from '@mnemo/common/models/card';
import { shuffle } from '@mnemo/common/utils/array';
import { EmojiType, emojis } from '@mnemo/common/utils/emojis';

class MemoryGame {
  private cards: PrivateCard[];

  constructor() {
    this.cards = shuffle(
      emojis[EmojiType.AnimalsAndNature].map((emoji, index) => ({ cardId: index, content: emoji })),
    );
  }

  public get boardCards() {
    return this.cards.map((c) => ({ ...c, content: null }));
  }

  public getCardById(cardId: number) {
    return this.cards.find((c) => c.cardId === cardId);
  }
}

export default MemoryGame;
