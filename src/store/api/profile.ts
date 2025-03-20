import { apiSlice } from './slice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBrightIDProfile: build.query<ProfileInfo, string>({
      query: (id) => ({
        url: `/brightid/v6/users/${id}/profile`,
      }),
      keepUnusedDataFor: 60,
      transformResponse: (res: UserProfileRes) => res.data,
      providesTags: (res) =>
        res?.id ? [{ type: 'BrightID' as const, id: res.id }] : [],
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
