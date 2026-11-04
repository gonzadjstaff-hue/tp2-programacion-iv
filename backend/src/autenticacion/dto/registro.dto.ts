import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegistroDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;
    @IsString()
    @IsNotEmpty()
    apellido!: string;
    @IsEmail()
    email!:string;
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    pasword!: string;

}