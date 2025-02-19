import recoveryData from 'BrightID/components/Onboarding/RecoveryFlow/recoveryDataSlice';

import { apiSlice } from '@/store/api/slice';

import keypair from './keypairSlice';
import operations from './operationsSlice';
import settings from './settingsSlice';
import user from './userSlice';

const reducers = {
  recoveryData,
  settings,
  operations,
  keypair,
  user,
  [apiSlice.reducerPath]: apiSlice.reducer,
};
export default reducers;
