import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../autenticacion/admin.guard';
import { EstadisticasService } from './estadisticas.service';
import { RangoFechasDto } from './dto/rango-fechas.dto';

@Controller('estadisticas')
@UseGuards(AdminGuard)
export class EstadisticasController {
    constructor(private readonly service: EstadisticasService) { }

    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(@Query() rango: RangoFechasDto) {
        return this.service.publicacionesPorUsuario(rango);
    }

    @Get('comentarios')
    comentarios(@Query() rango: RangoFechasDto) {
        return this.service.comentariosPorDia(rango);
    }

    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(@Query() rango: RangoFechasDto) {
        return this.service.comentariosPorPublicacion(rango);
    }
}
