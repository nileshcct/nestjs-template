import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body } = request;

    const startTime = Date.now();
    const { password, token, ...safeBody } = body || {};

    this.logger.log({
      msg: `Request Started: ${method} ${url}`,
      body: Object.keys(safeBody).length ? safeBody : undefined,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`Request Finished: ${method} ${url} +${duration}ms`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `Request Failed: ${method} ${url} +${duration}ms`,
          error.stack,
        );
        throw error; // rethrow — global filter will catch it
      }),
    );
  }
}
