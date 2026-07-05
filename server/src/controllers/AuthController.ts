import type { Request, Response, NextFunction } from 'express';
import type { IAuthService } from '../interfaces/IAuthService';
import type { AuthRequest } from '../middlewares/AuthMiddleware';
import { HttpStatus } from '../utils/constants/HttpStatus';
import { AppError } from '../utils/errors/AppError';
import { COOKIE_NAME, setRefreshCookie, clearRefreshCookie } from '../utils/cookieHelper';
export class AuthController {
  constructor(private _authService: IAuthService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._authService.register(req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const { refreshToken, ...clientPayload } = await this._authService.verifyAndRegister(email, otp);
      setRefreshCookie(res, refreshToken);
      res.status(HttpStatus.OK).json(clientPayload);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { refreshToken, ...clientPayload } = await this._authService.login(email, password);
      setRefreshCookie(res, refreshToken);
      res.status(HttpStatus.OK).json(clientPayload);
    } catch (error) {
      next(error);
    }
  };
  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const { refreshToken, ...clientPayload } = await this._authService.googleLogin(token);
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
      const result = await this._authService.refresh(token);
      res.status(HttpStatus.OK).json(result); 
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this._authService.logout(req.user!.userId);
      clearRefreshCookie(res);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this._authService.forgotPassword(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      const result = await this._authService.resetPassword(token, password);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this._authService.resendOtp(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}