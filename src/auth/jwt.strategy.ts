import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/models/jwt-payload.model';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    // private configService: ConfigService,
  ) {
    super({
      secretOrKey: 'top-secret',
      jwtFromRequest: function(req: Request) {
        var token = null;
        if (req && req.session) {
          token = req.session['token'];
        }
        return token;
      },
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { email } = payload;
    const user: UserEntity = await this.userRepository.findOneBy({email: email});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}