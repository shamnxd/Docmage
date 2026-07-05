import api from './index';
import { API_ROUTES } from '../constants/apiRoutes';
export const authApi = {
  login: async (credentials: Record<string, string>) => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data;
  },
  googleLogin: async (token: string) => {
    const response = await api.post(API_ROUTES.AUTH.GOOGLE_LOGIN, { token });
    return response.data;
  },
  register: async (userData: Record<string, string>) => {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
  },
  verify: async (data: { email: string; otp: string }) => {
    const response = await api.post(API_ROUTES.AUTH.VERIFY, data);
    return response.data;
  },
  resendOtp: async (email: string) => {
    const response = await api.post(API_ROUTES.AUTH.RESEND_OTP, { email });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },
  resetPassword: async (data: Record<string, string>) => {
    const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};