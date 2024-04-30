import { Controller, Post, Redirect, Session } from '@nestjs/common';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';

@Controller('logout')
export class LogoutController {
    @Post()
    @SkipAuth()
    @Redirect('/')
    postLogout(@Session() session: any) {
        session.destroy();
    }
}
