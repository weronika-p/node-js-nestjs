import { Body, Controller, Get, HttpException, HttpStatus, Post, Render, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';
import { LoginDto } from 'src/dto/login.dto';

@Controller('login')
export class LoginController {
    constructor(private authService: AuthService){}
    
    @Get()
    @SkipAuth()
    @Render('login')
    getLogin(@Session() session: any, @Req() req: Request) {
        return {
            pageTitle: 'Login',
            loginPath: true,
            formsCSS: true,
            authCSS: true,
            isAuthenticated: session.isLoggedIn,
            invalidError: req.flash('invalidError') ?? null,
            error: req.flash('error') ?? null
        }
    }

    @Post()
    @SkipAuth()
    async postLogin(@Body() body: LoginDto, @Session() session: any, @Res() res: Response, @Req() req: Request) {
        const { email, password } = body;
        try {
            const user = await this.authService.findUser({email: email});
            if (!user){
                req.flash('invalidError', 'Invalid email or password');
                return res.redirect('/login');
            }
            try {
                const token = await this.authService.generateToken(password, user);
                if (!token) {
                    req.flash('invalidError', 'Invalid email or password');
                }
                session['isLoggedIn'] = true;
                session['user'] = user;
                session['token'] = token.accessToken;
                session.save();
                return res.redirect('/');
            } catch (error) {
                console.log(error);
                return res.redirect('/login');
            }    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
