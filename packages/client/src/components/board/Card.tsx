import { PublicCard } from '@mnemo/common/models/card';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { style as typestyle } from 'typestyle';

import { revealCard } from '../../client/websocket';

import style from './Card.module.scss';

interface CardProps {
  card: PublicCard;
  width: number;
  height: number;
}

const Card = observer(({ card, width, height }: CardProps) => {
  const sizeStyle = typestyle({ width, height });

  const handleClick = useCallback(() => {
    revealCard(card);
  }, [card]);

  return (
    <div
      className={classNames(style.container, sizeStyle, { [style.flipped]: !!card.content })}
      onClick={handleClick}
    >
      <div className={classNames(style.card, style.back)} />
      <div className={classNames(style.card, style.front)}>{card.content}</div>
    </div>
  );
});

export default Card;
