import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isInitialized: boolean; // has the silent refresh on startup been attempted?
}

// Hydrate user from localStorage on startup (token is never stored there)
const hydrateUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  accessToken: null,
  user: hydrateUser(),
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
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem('auth_user');
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setAccessToken, clearCredentials, setInitialized } =
  authSlice.actions;

export default authSlice.reducer;
