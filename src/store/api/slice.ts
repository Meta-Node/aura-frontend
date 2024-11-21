import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { AURA_NODE_URL_PROXY } from 'constants/urls';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: AURA_NODE_URL_PROXY,
    mode: 'no-cors',
  }),
  endpoints: () => ({}),
});
