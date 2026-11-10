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
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    nombreUsuario!: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
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
    @IsNotEmpty({ message: 'Debés repetir la contraseña' })
    repetirPassword!: string;

    @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
    fechaNacimiento!: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsUrl()
    fotoPerfil?: string;

    @IsOptional()
    @IsIn(['usuario'], { message: 'No se puede elegir el rol al registrarse' })
    rol?: string;
}
