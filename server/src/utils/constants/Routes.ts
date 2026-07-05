export const ROUTES = {
  API_BASE: '/api',
  HEALTH: '/health',
  AUTH: {
    BASE: '/auth',
    REGISTER: '/register',
    VERIFY: '/verify',
    LOGIN: '/login',
    GOOGLE_LOGIN: '/google-login',
    REFRESH: '/refresh',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    RESEND_OTP: '/resend-otp',
    LOGOUT: '/logout',
  },
  PDF: {
    BASE: '/pdfs',
    UPLOAD: '/upload',
    LIST: '/',
    EXTRACT: '/:id/extract',
    DELETE: '/:id',
    DOWNLOAD: '/:id/download',
  },
} as const;