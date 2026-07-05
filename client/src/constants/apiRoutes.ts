export const API_ROUTES = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    GOOGLE_LOGIN: '/auth/google-login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH: '/auth/refresh',
  },
  PDF: {
    BASE: '/pdfs',
    UPLOAD: '/pdfs/upload',
    extract: (id: string) => `/pdfs/${id}/extract`,
    download: (id: string) => `/pdfs/${id}/download`,
    delete: (id: string) => `/pdfs/${id}`,
  },
} as const;