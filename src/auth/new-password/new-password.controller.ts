import { Body, Controller, HttpException, HttpStatus, Post, Redirect } from '@nestjs/common';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';
import { MoreThan } from 'typeorm';
import { AuthService } from '../auth.service';

@Controller('new-password')
export class NewPasswordController {
    constructor(private authService: AuthService){}

    @Post()
    @SkipAuth()
    @Redirect('/login')
    async postNewPassword(@Body() body: any) {
        const { password, userId, passwordToken } = body;
        try {
            const resetUser = await this.authService.findUser({resetToken: passwordToken, resetTokenExpiration: MoreThan(new Date()), id: userId});
            const hashedPassword = await this.authService.hashPassword(password);
            await this.authService.updateUser(resetUser.id, {password: hashedPassword, resetToken: null, resetTokenExpiration: null});
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
