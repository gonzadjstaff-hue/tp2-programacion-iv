import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicacionesService {
    obtenerPublicaciones(){
        return 'listado de publicaciones';
    }
}
