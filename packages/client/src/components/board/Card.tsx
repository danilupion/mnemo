import classNames from 'classnames';
import { style as typestyle } from 'typestyle';

import style from './Card.module.scss';

interface CardProps {
  content: string;
  width: number;
  height: number;
}

const Card = ({ content, width, height }: CardProps) => {
  const sizeStyle = typestyle({ width, height });

  return (
    <div className={classNames(style.container, sizeStyle)}>
      <div className={style.card}>{content}</div>
    </div>
  );
};

export default Card;
