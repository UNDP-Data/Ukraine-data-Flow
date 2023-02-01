import { createRoot } from 'react-dom/client';
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

const container = getEl('[data-bucket-embed]');
if (container) {
  const root = createRoot(container!); // createRoot(container!) if you use TypeScript
  root.render(<App />);
}

const mapContainer = getEl('[map-embed]');
if (mapContainer) {
  const root = createRoot(mapContainer!); // createRoot(container!) if you use TypeScript
  root.render(<App1 />);
}

const petroMapContainer = getEl('[petro-map-embed]');
if (petroMapContainer) {
  const root = createRoot(petroMapContainer!); // createRoot(container!) if you use TypeScript
  root.render(<App2 />);
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
