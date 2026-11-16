import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import type { SolicitudAutenticada } from '../autenticacion/autenticacion.guard';
import { TrimPipe } from '../trim.pipe';
import { ComentariosService } from './comentarios.service';
import { ComentarioDto } from './dto/comentario.dto';
import { ListarComentariosDto } from './dto/listar-comentarios.dto';

@Controller('publicaciones/:id/comentarios')
export class ComentariosController {
    constructor(private readonly service: ComentariosService) { }

    @Get()
    listar(@Param('id', TrimPipe) id: string, @Query() filtros: ListarComentariosDto) {
        return this.service.listar(id, filtros);
    }

    @Post()
    crear(
        @Param('id', TrimPipe) id: string,
        @Body() datos: ComentarioDto,
        @Req() solicitud: SolicitudAutenticada,
    ) {
        return this.service.crear(id, solicitud.usuario.sub, datos);
    }

    @Put(':comentarioId')
    modificar(
        @Param('id', TrimPipe) id: string,
        @Param('comentarioId', TrimPipe) comentarioId: string,
        @Body() datos: ComentarioDto,
        @Req() solicitud: SolicitudAutenticada,
    ) {
        return this.service.modificar(id, comentarioId, solicitud.usuario.sub, datos);
    }
}
