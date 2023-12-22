import { configureStore } from '@reduxjs/toolkit';
import reducers from 'BrightID/reducer';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import {
  createMigrate,
  MigrationManifest,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { __DEV__ } from 'utils/env';

import { profileSlice } from './profile';

const migrations: MigrationManifest = {
  1: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        splashScreenShown: false,
        playerOnboardingScreenShown: false,
      },
    };
  },
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localForage,
  blacklist: ['recoveryData'], // won't be persisted
  migrate: createMigrate(migrations, { debug: __DEV__ }),
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    ...reducers,
    profile: profileSlice.reducer,
  }),
);

// Define the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'recoveryData/setRecoveryChannel',
          'recoveryData/init',
        ],
        ignoredPaths: ['recoveryData'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;
