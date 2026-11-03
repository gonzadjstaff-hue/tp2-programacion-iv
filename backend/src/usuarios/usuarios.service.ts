import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
    findAll()
    {return [{nombre: 'Ana',mail: 'ana@ejemplo.com'}];
    }
}
