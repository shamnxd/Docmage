import type { Response } from 'express';
import { env } from '../config/Env';
export const COOKIE_NAME = 'refreshToken';
export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: env.REFRESH_TOKEN_MAX_AGE_MS,
  path: '/',
};
export const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
};
export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true, sameSite: cookieOptions.sameSite });
};