import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
    constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<Usuario>,
    ) {}
    async findAll() {
        return await this.usuarioModel.find().select('-password').exec();
    }
}
