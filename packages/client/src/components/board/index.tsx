import { Card as CardModel } from '@mnemo/common/models/card';
import { groupBy } from '@mnemo/common/utils/array';

import useSize from '../../hooks/useSize';

import Card from './Card';
import Line, { Direction } from './Line';
import styles from './index.module.scss';

interface BoardProps {
  cards: CardModel[];
  cardAspectRation: number;
}

const Board = ({ cards, cardAspectRation }: BoardProps) => {
  const [ref, { width, height }] = useSize();

  if (!width || !height) {
    return <div ref={ref} className={styles.cardsBoard} />;
  }

  const aspectRatio = width / height;
  const cardsCount = cards.length;
  const ratioRelation = cardAspectRation / aspectRatio;
  const direction = ratioRelation < 1 ? Direction.row : Direction.column;

  const lines =
    direction === Direction.row
      ? Math.ceil(Math.sqrt(cardsCount / ratioRelation))
      : Math.ceil(Math.sqrt(cardsCount * ratioRelation));
  const maxItemsPerLine = Math.ceil(cardsCount / lines);
  const numberOfGroups = Math.ceil(cardsCount / maxItemsPerLine);
  const groups = groupBy(
    cards,
    direction === Direction.row ? numberOfGroups : maxItemsPerLine,
    true,
  );
  let cardWidth = 1;
  let cardHeight = 1;

  switch (direction) {
    case Direction.column:
      cardHeight = height / numberOfGroups;
      cardWidth = cardHeight * cardAspectRation;
      if (cardWidth > width / maxItemsPerLine) {
        cardWidth = width / maxItemsPerLine;
        cardHeight = cardWidth / cardAspectRation;
      }
      break;
    case Direction.row:
      {
        cardWidth = width / numberOfGroups;
        cardHeight = cardWidth / cardAspectRation;
        if (cardHeight > height / maxItemsPerLine) {
          cardHeight = height / maxItemsPerLine;
          cardWidth = cardHeight * cardAspectRation;
        }
      }
      break;
  }

  return (
    <div ref={ref} className={styles.cardsBoard}>
      <Line direction={Direction.column}>
        {groups.map((group, index) => (
          <Line key={`${index}-${groups.length}`} direction={Direction.row}>
            {group.map((card) => (
              <Card key={card.cardId} width={cardWidth} height={cardHeight} card={card} />
            ))}
          </Line>
        ))}
      </Line>
    </div>
  );
};

export default Board;
