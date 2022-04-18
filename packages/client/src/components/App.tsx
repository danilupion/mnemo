import { observer } from 'mobx-react-lite';

import { useTableStore } from '../hooks/useStore';

import styles from './App.module.scss';
import Board from './board';
import Header from './header';

const App = observer(() => {
  const tableStore = useTableStore();

  return (
    <div className={styles.app}>
      <Header gameRunning={tableStore.isGameRunning} myTurn={tableStore.isMyTurn} />
      <Board cards={tableStore.deck} cardAspectRation={1} />
    </div>
  );
});

export default App;
