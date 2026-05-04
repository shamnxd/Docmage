import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors/AppError.js';
import { ErrorMessages } from '../utils/constants/Messages.js';
import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export class AuthMiddleware {
  constructor(private readonly jwtSecret: string) { }

  public handle = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(AppError.unauthorized(ErrorMessages.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; email: string };
      req.user = decoded;
      next();
    } catch (error) {
      next(AppError.unauthorized(ErrorMessages.UNAUTHORIZED));
    }
  };
}
