import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { opcionesImagen } from '../imagenes';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(
        private autenticacionService: AutenticacionService,
    ) { }

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

    @Post('login')
    @HttpCode( HttpStatus.OK)
    login(@Body() datos: LoginDto) {
        return this.autenticacionService.login(datos);
    }
}