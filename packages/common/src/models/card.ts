export type CardId = number;

export type PrivateCard = {
  cardId: CardId;
  content: string;
  discovered: boolean;
};

export type PublicCard = Omit<PrivateCard, 'content'> & {
  content: string | null;
};
