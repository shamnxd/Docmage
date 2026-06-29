import { HttpStatus } from '../constants/HttpStatus';
import { ErrorMessages } from '../constants/Messages';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = ErrorMessages.VALIDATION_ERROR) {
    return new AppError(message, HttpStatus.BAD_REQUEST);
  }

  static unauthorized(message: string = ErrorMessages.UNAUTHORIZED) {
    return new AppError(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = ErrorMessages.FORBIDDEN) {
    return new AppError(message, HttpStatus.FORBIDDEN);
  }

  static notFound(message: string = ErrorMessages.FILE_NOT_FOUND) {
    return new AppError(message, HttpStatus.NOT_FOUND);
  }

  static internal(message: string = ErrorMessages.INTERNAL_SERVER_ERROR) {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static conflict(message: string = ErrorMessages.USER_EXISTS) {
    return new AppError(message, HttpStatus.CONFLICT);
  }
}
