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
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(
        private autenticacionService: AutenticacionService,
    ) { }

    @Post('registro')
    @UseInterceptors(
        FileInterceptor('fotoPerfil', {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads'),
                filename: (req, file, callback) => {
                    const extensiones: Record<string, string> = {
                        'image/jpeg': '.jpg',
                        'image/png': '.png',
                        'image/webp': '.webp',
                    };

                    const extension = extensiones[file.mimetype];
                    callback(null, `${randomUUID()}${extension}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const permitidos = [
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                ];

                if (!permitidos.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Solo se permiten imágenes JPG, PNG o WEBP',
                        ),
                        false,
                    );
                }

                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    registrar(
        @Body() datos: RegistroDto,
        @UploadedFile() archivo?: Express.Multer.File,
    ) {
        if (!archivo) {
            throw new BadRequestException(
                'La foto de perfil es obligatoria',
            );
        }

        const fotoPerfil = `/uploads/${archivo.filename}`;

        return this.autenticacionService.registrar({
            ...datos,
            fotoPerfil,
        });
    }

    @Post('login')
    @HttpCode( HttpStatus.OK)
    login(@Body() datos: LoginDto) {
        return this.autenticacionService.login(datos);
    }
}