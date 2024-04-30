import { IsEmail, MinLength } from "class-validator";
import { Match } from "src/decorator/match.decorator";

export class SignUpCredentialsDto {
    @IsEmail(undefined, {message: 'Please enter a valid email'})
    email: string;

    @MinLength(5, {message: 'Please enter a password at least 5 characters'})
    password: string;

    @Match<SignUpCredentialsDto>('password')
    confirmPassword: string;
}