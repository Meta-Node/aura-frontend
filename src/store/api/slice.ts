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
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: AURA_NODE_URL_PROXY,
    mode: 'no-cors',
  }),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      if (!action.payload) {
        return undefined;
      }

      if (action.key === 'root') {
        return action.payload;
      }

      if (action.payload[reducerPath]) {
        return action.payload[reducerPath];
      }
    }

    return undefined;
  },

  endpoints: () => ({}),
  keepUnusedDataFor: 150,
});

export const { reducer } = apiSlice;
