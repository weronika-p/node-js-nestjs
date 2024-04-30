import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const skipAuth: boolean = this.reflector.get('skipAuth', context.getHandler());

      if (skipAuth) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromSession(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: 'top-secret'
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromSession(request: Request): string | undefined {
      // const [type, token] = request.headers.authorization?.split(' ') ?? [];
      // return type === 'Bearer' ? token : undefined;
      return request.session?.['token'];
    }
  }