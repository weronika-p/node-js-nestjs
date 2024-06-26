import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { join } from 'path';

@Catch(NotFoundException)
export class NotFoundFilter<T> implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.sendFile(join(__dirname, '../..', 'src/views', '404.html'));
  }
}
