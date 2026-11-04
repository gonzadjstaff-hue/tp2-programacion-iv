import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';

@Controller('autenticacion')
export class AutenticacionController {
    
    constructor(private autentiacionService:AutenticacionService) {

    }
    @Post('registro')
    registro(@Body() datos:any) { 
        return this.autentiacionService.registrar(datos);}
}
