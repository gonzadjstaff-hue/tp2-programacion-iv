import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    findAll() { return this.usuariosService.findAll(); }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('fotoPerfil', opcionesImagen))
    actualizar(
        @Param('id') id: string,
        @Body() datos: ActualizarUsuarioDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        return this.usuariosService.actualizar(id, datos, archivo);
    }
}
