import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ComentarioDto {
  @IsString()
  @MaxLength(300, { message: 'El comentario no puede superar los 300 caracteres' })
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  mensaje!: string;
}
