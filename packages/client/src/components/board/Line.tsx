import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { style as typestyle } from 'typestyle';

import styles from './Line.module.scss';

export enum Direction {
  row = 'row',
  column = 'column',
}

type LineProps = PropsWithChildren<{
  direction?: Direction;
}>;

const Line = ({ direction, children }: LineProps) => {
  const directionStyle = typestyle({ flexDirection: direction });

  return <div className={classNames(styles.line, directionStyle)}>{children}</div>;
};

Line.defaultProps = {
  direction: Direction.row,
};

export default Line;
