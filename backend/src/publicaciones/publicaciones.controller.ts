import { Controller, Get } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly service: PublicacionesService) { }
    @Get()
    obtenerPublicaciones() {
        return this.service.obtenerPublicaciones();
    }
}