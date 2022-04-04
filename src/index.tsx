// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import App, { App1, App2 } from './App';
import reportWebVitals from './reportWebVitals';

const getEl = (embedSelector: string) => {
  if (typeof embedSelector === 'string') {
    const el = document.querySelector(embedSelector);
    if (!el) {
      // eslint-disable-next-line no-console
      console.error(`No div matching selector "${embedSelector}"`);
      return null;
    }
    return el;
  }
  return embedSelector;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  getEl('[data-bucket-embed]'),
);
ReactDOM.render(
  <React.StrictMode>
    <App1 />
  </React.StrictMode>,
  getEl('[map-embed]'),
);

ReactDOM.render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
  getEl('[petro-map-embed]'),
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
