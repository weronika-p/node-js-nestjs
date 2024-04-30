import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { LoginController } from './login/login.controller';
import { SignupController } from './signup/signup.controller';
import { LogoutController } from './logout/logout.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ResetController } from './reset/reset.controller';
import { NewPasswordController } from './new-password/new-password.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({secret: 'top-secret', signOptions: {expiresIn: 3600}, global: true})
  ],
  controllers: [LoginController, SignupController, LogoutController, ResetController, NewPasswordController],
  providers: [AuthService, JwtStrategy, UserRepository],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
