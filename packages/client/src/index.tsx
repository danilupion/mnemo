import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import client from './client/websocket';
import App from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import tableStore from './stores/table';
import userStore from './stores/user';

client({
  name: userStore.name,
  gameEndHandler: () => {
    tableStore.isGameRunning = false;
    tableStore.isMyTurn = false;
  },
  gameStartHandler: (cards, scores) => {
    tableStore.ranking = scores;
    tableStore.cards = cards;
    tableStore.isGameRunning = true;
  },
  setCardContentHandler: tableStore.setCardContent,
  cardDiscoveredHandler: (cardIds, scores) => {
    cardIds.forEach((cardId) => tableStore.setCardDiscovered(cardId));
    tableStore.ranking = scores;
  },
  nextTurnHandler: (currentPlayer: string, myTurn: boolean) => {
    tableStore.clearCardsContent();
    tableStore.currentPlayer = currentPlayer;
    tableStore.isMyTurn = myTurn;
  },
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
