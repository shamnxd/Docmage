import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/store';
import { setAccessToken, setInitialized, clearCredentials } from './store/authSlice';
import './styles/global.css';
import App from './App.tsx';
import { refreshApi } from './services/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ─── Silent Refresh on app startup ───────────────────────────────────────────
// Runs once before the tree mounts. Attempts to exchange the HTTP-only
// refresh-token cookie for a fresh access token. Sets isInitialized when done.
function AppWithInit() {
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const { data } = await refreshApi.post<{ accessToken: string }>('/auth/refresh');
        store.dispatch(setAccessToken(data.accessToken));
      } catch {
        // No valid cookie → clear any stale user data
        store.dispatch(clearCredentials());
      } finally {
        store.dispatch(setInitialized());
      }
    };

    silentRefresh();
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppWithInit />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
