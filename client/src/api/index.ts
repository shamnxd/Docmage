import axios from 'axios';
import { store } from '../store/store';
import { setAccessToken, clearCredentials } from '../store/authSlice';
import { API_ROUTES } from '../constants/apiRoutes';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
export const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};
api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const isAuthRoute = originalRequest.url?.includes(API_ROUTES.AUTH.BASE);
    if (error.response?.status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const { data } = await refreshApi.post<{ accessToken: string }>(API_ROUTES.AUTH.REFRESH);
      const newToken = data.accessToken;
      store.dispatch(setAccessToken(newToken));
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      store.dispatch(clearCredentials());
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
export default api;