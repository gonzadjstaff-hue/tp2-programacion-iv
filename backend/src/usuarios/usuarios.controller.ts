import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { UsuariosService } from './usuarios.service';
import type { SolicitudAutenticada } from '../autenticacion/autenticacion.guard';
import { AdminGuard } from '../autenticacion/admin.guard';
import { RegistroDto } from '../autenticacion/dto/registro.dto';
import { TrimPipe } from '../trim.pipe';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    @UseGuards(AdminGuard)
    findAll() { return this.usuariosService.findAll(); }

    @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('fotoPerfil', opcionesImagen))
    crear(
        @Body() datos: RegistroDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        if (!archivo) {
            throw new BadRequestException('La foto de perfil es obligatoria');
        }

        return this.usuariosService.crear(datos, archivo, datos.rol ?? 'usuario');
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    deshabilitar(@Param('id', TrimPipe) id: string, @Req() solicitud: SolicitudAutenticada) {
        return this.usuariosService.cambiarHabilitado(id, false, solicitud.usuario.sub);
    }

    @Post(':id/habilitar')
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    habilitar(@Param('id', TrimPipe) id: string, @Req() solicitud: SolicitudAutenticada) {
        return this.usuariosService.cambiarHabilitado(id, true, solicitud.usuario.sub);
    }

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
