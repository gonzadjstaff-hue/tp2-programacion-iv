import { Controller, Get } from '@nestjs/common';

@Controller('publicaciones')
export class PublicacionesController {
  @Get()
  obtenerPublicaciones() {
    return 'Listado de publicaciones';
  }
}