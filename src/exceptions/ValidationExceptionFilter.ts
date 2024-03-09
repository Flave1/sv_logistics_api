import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name)
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(`${status} on ${request.url}  authorization=${request.headers.authorization} path=${request.url}`)

    if (status === HttpStatus.BAD_REQUEST) {
      this.logger.error('request', request)
      const errors = this.flattenValidationErrors(exception);

      response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors,
      });
    } else {

      // response.status(status).json({
      //   statusCode: status,
      //   message: 'Validation failed',
      //   errors,
      //   timestamp: new Date().toISOString(),
      //   path: request.url,
      // });
      console.log('here', status);
       
      response.status(status).json({ statusCode: status, message: exception.message  });
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
