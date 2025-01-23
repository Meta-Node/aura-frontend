import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AURA_NODE_URL_PROXY } from 'constants/urls';
import { Action } from 'redux';
import { REHYDRATE } from 'redux-persist';

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: never;
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
      // Check if action.payload exists
      if (!action.payload) {
        return undefined; // Return undefined if payload is not defined
      }

      // When persisting the api reducer
      if (action.key === 'key used with redux-persist') {
        return action.payload;
      }

      // When persisting the root reducer
      if (action.payload[reducerPath]) {
        return action.payload[reducerPath];
      }
    }

    return undefined; // Default return if no conditions are met
  },

  endpoints: () => ({}),
  keepUnusedDataFor: 150,
});

export const { reducer } = apiSlice;
