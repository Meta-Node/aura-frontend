import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import reducers from 'BrightID/reducer';
import localForage from 'localforage';
import { combineReducers } from 'redux';
import {
  createMigrate,
  MigrationManifest,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { PreferredView } from 'types/dashboard';
import { __DEV__ } from 'utils/env';

import { apiSlice } from './api/slice';
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
  2: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        preferredView: PreferredView.PLAYER,
      },
    };
  },
  3: (oldState: any) => {
    return {
      ...oldState,
      profile: {
        ...oldState.profile,
        authData: oldState.profile.authData
          ? {
              brightId: oldState.profile.authData.brightId,
              password: oldState.profile.authData.password,
            }
          : null,
      },
    };
  },
};

const persistConfig = {
  key: 'root',
  version: 3,
  storage: localForage,
  blacklist: ['recoveryData'], // won't be persisted
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
        // Ignore these action types
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
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;
