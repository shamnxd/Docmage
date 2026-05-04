import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors/AppError.js';
import { HttpStatus } from '../utils/constants/HttpStatus.js';
import { ErrorMessages } from '../utils/constants/Messages.js';

export const globalErrorHandler = (
  err: Error | AppError | ZodError | Record<string, unknown>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = ErrorMessages.INTERNAL_SERVER_ERROR;

  if (err && typeof err === 'object') {
    if ('statusCode' in err && typeof err.statusCode === 'number') {
      statusCode = err.statusCode;
    }
    if ('message' in err && typeof err.message === 'string') {
      message = err.message;
    }
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = err.issues.map((issue) => issue.message).join(', ') || ErrorMessages.VALIDATION_ERROR;
  }

  if (err && typeof err === 'object' && 'name' in err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = ErrorMessages.UNAUTHORIZED;
    }
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
