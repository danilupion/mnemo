import React from 'react';
import ReactDOM from 'react-dom/client';

import client from './client/websocket';
import App from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import tableStore from './stores/table';

client({
  setDeckHandler: tableStore.setDeck,
  setCardContentHandler: tableStore.setCardContent,
  setCardDiscoveredHandler: tableStore.setCardDiscovered,
  nextTurnHandler: tableStore.clearCardsContent,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
