export type PrivateCard = {
  cardId: number;
  content: string;
};

export type PublicCard = Omit<PrivateCard, 'content'> & {
  content: string | null;
};
