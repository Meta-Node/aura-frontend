import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import reducers from 'BrightID/reducer';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import { __DEV__ } from 'utils/env';

import { apiSlice } from './api/slice';
import { migrations } from './migrations';
import { profileSlice } from './profile';

localForage.config({
  storeName: 'keyvaluepairs',
  name: 'localforage',
});

const persistConfig = {
  key: 'root',
  version: 4,
  storage: localForage,
  blacklist: ['recoveryData'],
  migrate: createMigrate(migrations, { debug: __DEV__ }),
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    ...reducers,
    profile: profileSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  }),
);

export const store = configureStore({
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
    })
      .concat(apiSlice.middleware)
      .concat(),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;

setupListeners(store.dispatch);
