import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import type { SolicitudAutenticada } from './autenticacion.guard';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(
        private autenticacionService: AutenticacionService,
    ) { }

    @Public()
    @Post('registro')
    @UseInterceptors(FileInterceptor('fotoPerfil', opcionesImagen))
    registrar(
        @Body() datos: RegistroDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        if (!archivo) {
            throw new BadRequestException(
                'La foto de perfil es obligatoria',
            );
        }

        return this.autenticacionService.registrar(datos, archivo);
    }

    @Public()
    @Post('login')
    @HttpCode( HttpStatus.OK)
    login(@Body() datos: LoginDto) {
        return this.autenticacionService.login(datos);
    }

    @Post('autorizar')
    @HttpCode(HttpStatus.OK)
    autorizar(@Req() solicitud: SolicitudAutenticada) {
        return this.autenticacionService.autorizar(solicitud.usuario.sub);
    }

    @Post('refrescar')
    @HttpCode(HttpStatus.OK)
    refrescar(@Req() solicitud: SolicitudAutenticada) {
        return this.autenticacionService.refrescar(solicitud.usuario.sub, solicitud.usuario.rol);
    }
}
