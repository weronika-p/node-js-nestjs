import { Body, Controller, Get, HttpException, HttpStatus, Post, Render, Req, Res, Session, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../auth.service';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';
import { ValidationExceptionFilter } from 'src/filters/validation-exception.filter';
import { SignUpCredentialsDto } from 'src/dto/sign-up-credentials.dto';

@Controller('signup')
export class SignupController {
    constructor(private authService: AuthService){}

    @Get()
    @SkipAuth()
    @Render('signup')
    getSignup(@Session() session: any, @Req() req: Request) {
        return {
            pageTitle: 'Singup',
            signupPath: true,
            formsCSS: true,
            authCSS: true,
            isAuthenticated: session.isLoggedIn,
            errors: req.flash('error') ?? null,
            old: req.flash('old') ?? {email: '', password: '', confirmPassword: ''}
        }
    }

    @Post()
    @SkipAuth()
    @UseFilters(ValidationExceptionFilter)
    async postSignup(@Body() body: SignUpCredentialsDto, @Res() res: Response) {
        const { email, password } = body
        try {
            const hashedPassword = await this.authService.hashPassword(password);
            await this.authService.createUser({email: email, password: hashedPassword});
            const htmlCode = '<h1>You successfully signed up!</h1>';
            await this.authService.sendMail(email, 'Signup succeeded!', htmlCode);
            return res.redirect('/login');    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
