import { Catch, HttpException } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    const errorResponse = {
      statusCode: status,
      message: message,
    };
    response.code(status).send(errorResponse);
  }
}
