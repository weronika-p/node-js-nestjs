import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const req = context.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 500) {
      return res
      .status(status)
      .render('500', {
          pageTitle: 'Error!',
          isAuthenticated: req.session['isLoggedIn']
      });
    }

    if (status === 401) {
      return res.status(status).redirect('/login');
    }

    req.flash('error', exception.message);
    res.redirect('back');
  }
}