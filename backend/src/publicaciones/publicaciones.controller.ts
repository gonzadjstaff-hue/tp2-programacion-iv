import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import type { SolicitudAutenticada } from '../autenticacion/autenticacion.guard';
import { TrimPipe } from '../trim.pipe';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly service: PublicacionesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('imagen', opcionesImagen))
    crear(
        @Body() datos: CrearPublicacionDto,
        @Req() solicitud: SolicitudAutenticada,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        return this.service.crear(solicitud.usuario.sub, datos, archivo);
    }

    @Get()
    listar(@Query() filtros: ListarPublicacionesDto) {
        return this.service.listar(filtros);
    }

    @Delete(':id')
    eliminar(@Param('id', TrimPipe) id: string, @Req() solicitud: SolicitudAutenticada) {
        return this.service.eliminar(id, solicitud.usuario.sub);
    }

    @Post(':id/me-gusta')
    darMeGusta(@Param('id', TrimPipe) id: string, @Req() solicitud: SolicitudAutenticada) {
        return this.service.darMeGusta(id, solicitud.usuario.sub);
    }

    @Delete(':id/me-gusta')
    quitarMeGusta(@Param('id', TrimPipe) id: string, @Req() solicitud: SolicitudAutenticada) {
        return this.service.quitarMeGusta(id, solicitud.usuario.sub);
    }

    @Get(':id')
    obtener(@Param('id', TrimPipe) id: string) {
        return this.service.obtener(id);
    }
}
