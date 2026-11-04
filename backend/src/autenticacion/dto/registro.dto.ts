import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    IsDateString,
    IsOptional,
    IsUrl,
    IsIn,
    Matches,
} from 'class-validator';

export class RegistroDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    apellido!: string;

    @IsString()
    @IsNotEmpty()
    nombreUsuario!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8, {
        message: 'La contraseña debe tener al menos 8 caracteres',
    })
    @Matches(/[A-Z]/, {
        message: 'La contraseña debe contener al menos una mayúscula',
    })
    @Matches(/[0-9]/, {
        message: 'La contraseña debe contener al menos un número',
    })
    password!: string;

    @IsString()
    @IsNotEmpty()
    repetirPassword!: string;

    @IsDateString()
    fechaNacimiento!: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsUrl()
    fotoPerfil?: string;

    @IsOptional()
    @IsIn(['usuario'])
    rol?: string;
}