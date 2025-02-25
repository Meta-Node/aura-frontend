import { apiSlice } from './slice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBrightIDProfile: build.query<ProfileInfo, { id: string }>({
      query: ({ id }) => ({
        url: `/brightid/v6/users/${id}/profile`,
      }),
      transformResponse: (res: UserProfileRes) => res.data,
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
  overrideExisting: true,
});

export const {
  useGetConnectionsQuery,
  useGetBrightIDProfileQuery,
  useLazyGetBrightIDProfileQuery,
} = profileApi;
