import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from 'react-aria-components';
import { App } from './app/App';
import './app/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider locale="en-US">
      <App />
    </I18nProvider>
  </StrictMode>,
);
