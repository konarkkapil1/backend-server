import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export interface IUser {
    id: number;
    uid: string;
    name: string;
    email: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRo {
    user: IUser,
    token: string
}

export class CreateUserDto {

    @IsString()
    @MinLength(3, {
        message: `name must be atleast 3 characters long`
    })
    @MaxLength(50)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(4, {
        message: "password must be atleast 4 characters long"
    })
    password: string;

    @IsOptional()
    @IsString()
    readonly address?: string;
}

export class LoginUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4, {
        message: "password must be atleast 4 characters long"
    })
    password: string;
}