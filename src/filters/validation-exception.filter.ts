import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from 'src/exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const req = context.getRequest<Request>();

    let errors: string[] = [];
    for (const error of exception.errors) {
      errors = Object.values(error.constraints ?? {});
    }

    req.flash('error', errors);
    req.flash('old', req.body);
    res.redirect('back');
  }
}