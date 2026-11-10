import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { UsuarioIdDto } from './dto/usuario-id.dto';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private readonly service: PublicacionesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('imagen', opcionesImagen))
    crear(
        @Body() datos: CrearPublicacionDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        const imagen = archivo ? `/uploads/${archivo.filename}` : undefined;
        return this.service.crear(datos, imagen);
    }

    @Get()
    listar(@Query() filtros: ListarPublicacionesDto) {
        return this.service.listar(filtros);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string, @Body() datos: UsuarioIdDto) {
        return this.service.eliminar(id, datos.usuarioId);
    }

    @Post(':id/me-gusta')
    darMeGusta(@Param('id') id: string, @Body() datos: UsuarioIdDto) {
        return this.service.darMeGusta(id, datos.usuarioId);
    }

    @Delete(':id/me-gusta')
    quitarMeGusta(@Param('id') id: string, @Body() datos: UsuarioIdDto) {
        return this.service.quitarMeGusta(id, datos.usuarioId);
    }

    @Get(':id/comentarios')
    listarComentarios(@Param('id') id: string) {
        return this.service.listarComentarios(id);
    }
}
