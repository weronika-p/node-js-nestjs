import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';
import { MoreThan } from 'typeorm';
import { AuthService } from '../auth.service';

@Controller('reset')
export class ResetController {
    constructor(private authService: AuthService) {}

    @Get()
    @SkipAuth()
    @Render('reset')
    getReset(@Req() req: Request) {
        return {pageTitle: 'Reset Password', formsCSS: true, authCSS: true, error: req.flash('error') ?? null}
    }

    @Post()
    @SkipAuth()
    async postReset(@Body() body: any, @Res() res: Response) {
        try {
            const token = await this.authService.createToken();
            const user = await this.authService.findUser({email: body.email});
            if (!user) {
                throw new BadRequestException('No account with that email found.');
            }
            const expiration = new Date(Date.now() + 3600000);
            await this.authService.updateUser(user.id, {resetToken: token, resetTokenExpiration: expiration});
            const htmlCode = `
                <p>You requested a password reset</p>
                <p>Click this <a href="https://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `
            await this.authService.sendMail(user.email, 'Password reset', htmlCode);
            return res.redirect('/');    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':token')
    @SkipAuth()
    @Render('new-password')
    async getNewPassword(@Req() req: Request, @Param('token') token: string) {
        try {
            const user = await this.authService.findUser({resetToken: token, resetTokenExpiration: MoreThan(new Date())});
            return { pageTitle: 'Reset Password', userId: user.id.toString(), passwordToken: token, error: req.flash('error') ?? null, formsCSS: true, authCSS: true}    
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
