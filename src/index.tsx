import './assets/fonts/fonts.css';
import './App.scss';

//...
import * as Sentry from '@sentry/react';
import NodeApiGateContextProvider from 'BrightID/components/NodeApiGate';
import { BrowserHistoryContextProvider } from 'contexts/BrowserHistoryContext';
import { SubjectsListContextProvider } from 'contexts/SubjectsListContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { backendApi, isThereProblemWithEncryption } from './api';
import App from './App';
import { persistor, store } from './store';
import { refreshKeyPairThunk } from './store/profile/actions';

Sentry.init({
  dsn: 'https://6294f4d2fd5ba93d12c1aa4a5029d36c@o4505929495150592.ingest.sentry.io/4505929496657920',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

backendApi.interceptors.response.use(
  (response) => response,
  (error) =>
    new Promise((_resolve, reject) => {
      if (isThereProblemWithEncryption(error.response?.data)) {
        store
          .dispatch(refreshKeyPairThunk())
          .then(() => {
            reject(new Error('retryRequest'));
          })
          .catch((_e) => {
            console.log(_e);
            reject(error);
          });
      } else {
        reject(error);
      }
    }),
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SubjectsListContextProvider>
          <NodeApiGateContextProvider>
            <BrowserRouter>
              <BrowserHistoryContextProvider>
                <App />
              </BrowserHistoryContextProvider>
            </BrowserRouter>
          </NodeApiGateContextProvider>
        </SubjectsListContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
