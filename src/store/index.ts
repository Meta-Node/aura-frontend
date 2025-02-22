import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import localForage from 'localforage';

import reducers from 'BrightID/reducer';
import { __DEV__ } from 'utils/env';
import { apiSlice } from './api/slice';
import { migrations } from './migrations';
import { profileSlice } from './profile';

const persistConfig = {
  key: 'root',
  version: 4,
  storage: localForage,
  blacklist: ['recoveryData'],
  migrate: createMigrate(migrations, { debug: __DEV__ }),
};

const rootReducer = combineReducers({
  ...reducers,
  profile: profileSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureAppStore(preloadedState?: any) {
  localForage.config({
    storeName: 'keyvaluepairs',
    name: 'localforage',
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
      }).concat(apiSlice.middleware),
    preloadedState,
  });

  const persistor = persistStore(store);

  setupListeners(store.dispatch);

  return { store, persistor };
}

export type AppStore = ReturnType<typeof configureAppStore>['store'];
export type AppDispatch = AppStore['dispatch'];
export type GetState = AppStore['getState'];
export type RootState = ReturnType<GetState>;
