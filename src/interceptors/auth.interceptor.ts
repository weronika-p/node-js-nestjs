// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Request } from 'express';

// @Injectable()
// export class AuthInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest<Request>();
//     const token = localStorage.getItem('accessToken');
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     res.locals.csrfToken = req.csrfToken();
//     if (token) {
//         req.headers['Authorization'] = `Bearer ${token}`;
      
//       // Pass the modified request to the next handler
//       return next.handle();
//     } else {
//       // If no token found, proceed without modification
//       return next.handle();
//     }
//   }
// }
