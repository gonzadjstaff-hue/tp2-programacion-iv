import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { UsuariosService } from './usuarios.service';
import type { SolicitudAutenticada } from '../autenticacion/autenticacion.guard';
import { TrimPipe } from '../trim.pipe';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    findAll() { return this.usuariosService.findAll(); }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('fotoPerfil', opcionesImagen))
    actualizar(
        @Param('id', TrimPipe) id: string,
        @Body() datos: ActualizarUsuarioDto,
        @Req() solicitud: SolicitudAutenticada,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        return this.usuariosService.actualizar(id, solicitud.usuario.sub, datos, archivo);
    }
}
