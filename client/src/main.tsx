import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/store';
import { setCredentials, setInitialized, clearCredentials } from './store/authSlice';
import './styles/global.css';
import App from './App.tsx';
import { refreshApi } from './api/index';
import { API_ROUTES } from './constants/apiRoutes';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function AppWithInit() {
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const { data } = await refreshApi.post<{ 
          accessToken: string; 
          user: { id: string; email: string; name?: string } 
        }>(API_ROUTES.AUTH.REFRESH);
        store.dispatch(setCredentials({
          accessToken: data.accessToken,
          user: data.user
        }));
      } catch {
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