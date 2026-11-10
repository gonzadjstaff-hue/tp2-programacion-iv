import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion!: string;

  @IsMongoId({ message: 'El usuario no es válido' })
  usuarioId!: string;
}
