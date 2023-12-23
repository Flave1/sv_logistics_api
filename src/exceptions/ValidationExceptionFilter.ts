import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;


    if (status === HttpStatus.BAD_REQUEST) {
        
      const errors = this.flattenValidationErrors(exception);
      response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {

      console.log('exception on any', exception);
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private flattenValidationErrors(exception: HttpException): Record<string, string[]> {
    const validationErrors: ValidationError[] = exception.getResponse()['message'];

    return validationErrors.reduce((acc, error) => {
      Object.entries(error.constraints).forEach(([key, message]) => {
        acc[key] = [...(acc[key] || []), message];
      });

      return acc;
    }, {});
  }
}
