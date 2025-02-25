import { decryptData } from '@/utils/crypto';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Action } from 'redux';
import { REHYDRATE } from 'redux-persist';

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: never;
  err: unknown;
} {
  return action.type === REHYDRATE;
}

export const backupApiSlice = createApi({
  reducerPath: 'backupApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: '/brightid/backups',
    mode: 'no-cors',
  }),
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      if (!action.payload) {
        return undefined;
      }

      if (action.key === 'root') {
        return action.payload[reducerPath];
      }
    }

    return undefined;
  },

  endpoints: (build) => ({
    getProfilePhoto: build.query<
      string,
      { key: string; brightId: string; password: string }
    >({
      query: ({ brightId, key }) => ({
        url: `/${key}/${brightId}`,
        method: 'GET',
        responseHandler: 'text',
      }),
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (response: string, meta, args) => {
        return decryptData(response, args.password);
      },
    }),
  }),
  keepUnusedDataFor: 5000,
});

export const { reducer } = backupApiSlice;

export const { getProfilePhoto } = backupApiSlice.endpoints;

export const { useGetProfilePhotoQuery, useLazyGetProfilePhotoQuery } =
  backupApiSlice;
