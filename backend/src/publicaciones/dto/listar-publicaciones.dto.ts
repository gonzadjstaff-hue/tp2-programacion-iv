import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class ListarPublicacionesDto {
  @IsOptional()
  @IsIn(['fecha', 'meGusta'], { message: 'El orden debe ser fecha o meGusta' })
  orden?: string;

  @IsOptional()
  @IsMongoId({ message: 'El usuario no es válido' })
  usuario?: string;

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
