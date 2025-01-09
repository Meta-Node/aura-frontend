import { decryptData } from 'utils/crypto';

import { apiSlice } from './slice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBrightIDProfile: build.query<ProfileInfo, { id: string }>({
      query: ({ id }) => ({
        url: `/brightid/v6/users/${id}/profile`,
      }),
      transformResponse: (res: UserProfileRes) => res.data,
    }),

    getProfilePhoto: build.query<
      string,
      { key: string; brightId: string; password: string }
    >({
      query: ({ brightId, key }) => ({
        url: `/backups/${key}/${brightId}`,
      }),
      transformResponse: (response: string, meta, args) =>
        decryptData(response, args.password),
    }),
    getConnections: build.query<
      ConnectionInfo[],
      { id: number; direction: 'inbound' | 'outbound' }
    >({
      query: ({ direction, id }) => ({
        url: `/users/${id}/connections/${direction}`,
      }),

      transformResponse: (res: UserConnectionsRes) => res.data.connections,
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useGetBrightIDProfileQuery,
  useGetProfilePhotoQuery,
  useLazyGetProfilePhotoQuery,
} = profileApi;
