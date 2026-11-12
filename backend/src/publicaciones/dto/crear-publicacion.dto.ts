import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion!: string;

  @IsMongoId({ message: 'El usuario no es válido' })
  usuarioId!: string;
}
