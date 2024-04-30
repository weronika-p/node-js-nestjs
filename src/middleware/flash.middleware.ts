import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    export interface Request {
      flash(key: string, value: unknown): unknown;

      flash(key: string): unknown | undefined;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    flash: { [key: string]: unknown };
  }
}

@Injectable()
export class FlashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    req.flash = (key: string, value?: unknown) => {
      const session = req.session;
      session.flash = session.flash ?? {};

      if (value !== undefined) {
        session.flash[key] = value;
        return value;
      }

      const result = session.flash[key];
      delete session.flash[key];
      return result;
    };

    next();
  }
}