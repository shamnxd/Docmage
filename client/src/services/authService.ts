import api from './api';

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  googleLogin: async (token: string) => {
    const response = await api.post('/auth/google-login', { token });
    return response.data;
  },
  register: async (userData: Record<string, string>) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  verify: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify', data);
    return response.data;
  },
  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (data: Record<string, string>) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
