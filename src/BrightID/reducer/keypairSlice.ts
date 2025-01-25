import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RESET_STORE } from 'BrightID/actions/resetStore';
import { RootState } from 'store';

const initialState: { publicKey: string; secretKey: string } = {
  publicKey: '',
  secretKey: '', // Use Base64-encoded string to make it serializable
};

const keypairSlice = createSlice({
  name: 'keypair',
  initialState,
  reducers: {
    setKeypair(state, action: PayloadAction<Keypair>) {
      const { publicKey, secretKey } = action.payload;
      state.publicKey = publicKey;
      state.secretKey = btoa(String.fromCharCode(...new Uint8Array(secretKey))); // Convert Uint8Array to Base64
    },
  },
  extraReducers: {
    [RESET_STORE]: () => {
      return initialState;
    },
  },
});

// Export channel actions
export const { setKeypair } = keypairSlice.actions;

// Export selectors
export const selectKeypair = (state: RootState) => ({
  publicKey: state.keypair.publicKey,
  secretKey: state.keypair.secretKey
    ? new Uint8Array(
        atob(state.keypair.secretKey)
          .split('')
          .map((char) => char.charCodeAt(0)),
      )
    : null, // Decode Base64 back to Uint8Array when accessing
});

// Export reducer
export default keypairSlice.reducer;
