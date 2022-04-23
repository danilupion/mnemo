import { observer } from 'mobx-react-lite';

import { startGame } from '../../client/websocket';
import { useTableStore, useUiStore } from '../../hooks/useStore';

import styles from './index.module.scss';

const Header = observer(() => {
  const tableStore = useTableStore();
  const uiStore = useUiStore();

  return (
    <div className={styles.header}>
      {!tableStore.isGameRunning && <button onClick={startGame}>Empezar</button>}
      <button onClick={uiStore.openScoreBoard}>Mostrar Puntuación</button>
      {tableStore.isMyTurn ? (
        <p>Tu turno</p>
      ) : (
        tableStore.currentPlayer && <p>{`Turno de ${tableStore.currentPlayer}`}</p>
      )}
    </div>
  );
});

export default Header;
