import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListarComentariosDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0, { message: 'offset no puede ser negativo' })
  @IsInt({ message: 'offset debe ser un número entero' })
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @Max(50, { message: 'limit no puede ser mayor a 50' })
  @Min(1, { message: 'limit debe ser al menos 1' })
  @IsInt({ message: 'limit debe ser un número entero' })
  limit?: number;
}
