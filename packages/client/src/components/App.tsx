import styles from './App.module.scss';
import Board from './board';

const cards = [...Array(72).keys()].map((k) => (k + 1).toString());

function App() {
  return (
    <div className={styles.app}>
      <Board cards={cards} cardAspectRation={1} />
    </div>
  );
}

export default App;
