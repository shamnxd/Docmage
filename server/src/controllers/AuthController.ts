import type { Request, Response, NextFunction } from 'express';
import type { IAuthService } from '../interfaces/IAuthService';
import { HttpStatus } from '../utils/constants/HttpStatus';
import { env } from '../config/Env';
import { AppError } from '../utils/errors/AppError';

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

// ─── Cookie helper ─────────────────────────────────────────────────────────────
const COOKIE_NAME = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/** Strip refreshToken from response body — it lives in the cookie instead */
const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true, sameSite: cookieOptions.sameSite });
};

// ─── Controller ───────────────────────────────────────────────────────────────
export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const { refreshToken, ...clientPayload } = await this.authService.verifyAndRegister(email, otp);
      setRefreshCookie(res, refreshToken);
      res.status(HttpStatus.OK).json(clientPayload);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { refreshToken, ...clientPayload } = await this.authService.login(email, password);
      setRefreshCookie(res, refreshToken);
      res.status(HttpStatus.OK).json(clientPayload);
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const { refreshToken, ...clientPayload } = await this.authService.googleLogin(token);
      setRefreshCookie(res, refreshToken);
      res.status(HttpStatus.OK).json(clientPayload);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies[COOKIE_NAME] as string | undefined;
      if (!token) throw AppError.unauthorized('No refresh token');

      const result = await this.authService.refresh(token);
      res.status(HttpStatus.OK).json(result); // only { accessToken } returned
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Clear refresh-token from DB (blacklisting) and from cookie
      await this.authService.logout(req.user!.userId);
      clearRefreshCookie(res);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      const result = await this.authService.resetPassword(token, password);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOtp(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
