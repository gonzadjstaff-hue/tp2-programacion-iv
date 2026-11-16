import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido!: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  fechaNacimiento!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
