import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtPayload } from 'src/models/jwt-payload.model';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService){}
    
    async generateToken(password: string, user: UserEntity): Promise<{ accessToken: string }> {
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            const payload: JwtPayload = { email: user.email };
            const accessToken: string = this.jwtService.sign(payload);
            return { accessToken };
        }
    }

    async createUser(userData: LoginDto) {
        return await this.userRepository.createUser(userData);
    }

    async findUser(param: any) {
        return await this.userRepository.findOneBy(param);
    }

    async sendMail(email: string, subject: string, htmlCode: string) {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "60300d62e02185",
              pass: "bee0ff45b01b43"
            }
          });
          return await transporter.sendMail({
            to: email,
            from: 'shop@node-complete.com',
            subject: subject,
            html: htmlCode
          });
    }

    async createToken() {
        try {
            const buf = randomBytes(32);
            return buf.toString('hex');
        } catch (error) {
            throw new Error('Error generating random bytes.');
        }
    }

    async updateUser(userId: string, partialEntity: any) {
        return await this.userRepository.update({id: userId}, partialEntity);
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }
}
