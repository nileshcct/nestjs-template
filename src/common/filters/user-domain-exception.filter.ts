import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import type { Response } from 'express';
import { EmailAlreadyExistsError } from 'src/modules/users/domain/errors/email-already-exits.error';

@Catch(EmailAlreadyExistsError, UserNotFoundError)
export class UserDomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let status: HttpStatus;
    let message: string;

    // Handle known domain errors
    if (exception instanceof EmailAlreadyExistsError) {
      status = HttpStatus.CONFLICT; // 409
      message = 'Email already exists';
    } else if (exception instanceof UserNotFoundError) {
      status = HttpStatus.NOT_FOUND; // 404
      message = 'User not found';
    } else {
      // This should never happen because of @Catch(), but TypeScript safety
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
    }

    // Always send a consistent JSON response
    res.status(status).json({
      status: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}