import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AURA_NODE_URL_PROXY } from 'constants/urls';
import { Action } from 'redux';
import { REHYDRATE } from 'redux-persist';
import { RootState } from 'store';

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: RootState;
  err: unknown;
} {
  return action.type === REHYDRATE;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: AURA_NODE_URL_PROXY,
    mode: 'no-cors',
  }),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      // when persisting the api reducer
      if (action.key === 'key used with redux-persist') {
        return action.payload;
      }

      // When persisting the root reducer
      return action.payload[apiSlice.reducerPath];
    }
  },

  endpoints: () => ({}),
  keepUnusedDataFor: 30,
});

export const { reducer } = apiSlice;
