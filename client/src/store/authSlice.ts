import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isInitialized: boolean; 
}
const initialState: AuthState = {
  accessToken: null,
  user: null,
  isInitialized: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});
export const { setCredentials, setAccessToken, clearCredentials, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;