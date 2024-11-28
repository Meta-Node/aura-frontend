import { AuraNodeBrightIdConnection, AuraNodeConnectionsResponse } from 'types';

import { apiSlice } from './slice';

export const connectionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOutboundConnections: build.query<
      AuraNodeBrightIdConnection[],
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/brightid/v6/users/${id}/connections/outbound?withVerifications=true`,
      }),
      transformResponse: (res: AuraNodeConnectionsResponse) =>
        res.data.connections,
    }),
    getInboundConnections: build.query<
      AuraNodeBrightIdConnection[],
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/brightid/v6/users/${id}/connections/inbound?withVerifications=true`,
      }),
      transformResponse: (res: AuraNodeConnectionsResponse) =>
        res.data.connections,
    }),
  }),
});

export const { useGetInboundConnectionsQuery, useGetOutboundConnectionsQuery } =
  connectionsApi;