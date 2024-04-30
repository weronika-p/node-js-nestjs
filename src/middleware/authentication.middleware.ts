import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
    res.locals.isAuthenticated = req.session['isLoggedIn'];
    res.locals.token = req.session['token'];
    next();
};