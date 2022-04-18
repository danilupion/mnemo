import { startGame } from '../../client/websocket';

import styles from './index.module.scss';

interface HeaderProps {
  myTurn: boolean;
  gameRunning: boolean;
}

const Header = ({ gameRunning, myTurn }: HeaderProps) => {
  return (
    <div className={styles.header}>
      {!gameRunning && <button onClick={startGame}>Start</button>}
      {myTurn && <p>Your turn</p>}
    </div>
  );
};

export default Header;
