import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers, Middleware } from 'redux';
import {
  createMigrate,
  persistReducer,
  persistStore,
  PERSIST,
  PURGE,
  REHYDRATE,
} from 'redux-persist';
import localForage from 'localforage';

import reducers from 'BrightID/reducer';
import { __DEV__ } from 'utils/env';
import { apiSlice } from './api/slice';
import { migrations } from './migrations';
import { profileSlice } from './profile';
import { backupApiSlice } from './api/backup';
import {
  withReduxStateSync,
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';

const persistConfig = {
  key: 'root',
  version: 4,
  storage: localForage,
  blacklist: ['recoveryData'],
  migrate: createMigrate(migrations, { debug: __DEV__ }),
};

const rootReducer = withReduxStateSync(
  combineReducers({
    ...reducers,
    profile: profileSlice.reducer,
  }),
);

const persistedReducer = persistReducer(persistConfig, rootReducer);

localForage.config({
  storeName: 'keyvaluepairs',
  name: 'localforage',
});

export function configureAppStore(preloadedState?: any) {
  const syncMiddleware = createStateSyncMiddleware({
    channel: 'AURA_UPDATE_CHANNEL',
    broadcastChannelOption: {
      type: typeof window !== 'undefined' ? 'localstorage' : 'native',
    },
    blacklist: [
      PERSIST,
      PURGE,
      REHYDRATE,
      apiSlice.reducerPath,
      profileSlice.reducerPath,
      '__rtkq/unfocused',
      '__rtkq/focused',
    ],
  });

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'recoveryData/setRecoveryChannel',
            'recoveryData/init',
            apiSlice.reducerPath,
          ],
          ignoredPaths: ['recoveryData'],
        },
        immutableCheck: false,
      }).concat(
        apiSlice.middleware,
        backupApiSlice.middleware,
        syncMiddleware as Middleware,
      ),
    preloadedState,
  });

  const persistor = persistStore(store);

  setupListeners(store.dispatch);
  initMessageListener(store);

  return { store, persistor };
}

export type AppStore = ReturnType<typeof configureAppStore>['store'];
export type AppDispatch = AppStore['dispatch'];
export type GetState = AppStore['getState'];
export type RootState = ReturnType<GetState>;
