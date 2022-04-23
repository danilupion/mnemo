import { observer } from 'mobx-react-lite';

import { useTableStore, useUiStore } from '../hooks/useStore';

import styles from './App.module.scss';
import Board from './board';
import Header from './header';
import ScoreBoard from './scoreBoard';

const App = observer(() => {
  const tableStore = useTableStore();
  const uiStore = useUiStore();

  return (
    <div className={styles.app}>
      {uiStore.isScoreBoardOpen && <ScoreBoard />}
      <Header />
      <Board cards={tableStore.cards} cardAspectRation={1} />
    </div>
  );
});

export default App;
