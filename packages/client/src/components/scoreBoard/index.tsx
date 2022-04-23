import { observer } from 'mobx-react-lite';

import { useTableStore, useUiStore } from '../../hooks/useStore';

import styles from './index.module.scss';

const ScoreBoard = observer(() => {
  const tableStore = useTableStore();
  const uiStore = useUiStore();

  return (
    <div className={styles.scoreBoard}>
      <h1>
        Puntuación <button onClick={uiStore.closeScoreBoard}>Cerrar</button>
      </h1>
      <ul>
        {tableStore.ranking.map((player) => (
          <li key={player.playerName}>
            {player.playerName} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ScoreBoard;
