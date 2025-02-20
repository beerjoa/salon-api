import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

/**
 * Global exception filter
 * Catches and handles unexpected errors globally
 *
 * @class
 */
@Catch(Error)
export class GlobalExceptionFilter {
  protected readonly error = Error.name;
  protected readonly status = HttpStatus.INTERNAL_SERVER_ERROR;

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const errorResponse = {
      statusCode: this.status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };
    response.code(this.status).send(errorResponse);
  }
}
