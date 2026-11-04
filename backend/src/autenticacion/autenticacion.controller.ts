import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacion')
export class AutenticacionController {

    constructor(
        private autentiacionService: AutenticacionService
    ) { }

    @Post('registro')
    registro(@Body() datos: RegistroDto) {
        return this.autentiacionService.registrar(datos);
    }

    @Post('login')
    login(@Body() datos: LoginDto) {
        return { mensaje: 'Login recibido' };
    }

}

