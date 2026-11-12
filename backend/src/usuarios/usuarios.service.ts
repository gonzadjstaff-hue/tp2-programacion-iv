import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Usuario } from './schemas/usuario.schema';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { subirImagen } from '../imagenes';

@Injectable()
export class UsuariosService {
    constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<Usuario>,
    ) {}
    async findAll() {
        return await this.usuarioModel.find().select('-password').exec();
    }

    async actualizar(id: string, datos: ActualizarUsuarioDto, archivo?: Express.Multer.File) {
        if (datos.usuarioId !== id) {
            throw new ForbiddenException('Solo podés editar tu propio perfil');
        }

        const usuario = isValidObjectId(id) ? await this.usuarioModel.findById(id) : null;

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        usuario.nombre = datos.nombre;
        usuario.apellido = datos.apellido;
        usuario.fechaNacimiento = datos.fechaNacimiento;
        usuario.descripcion = datos.descripcion;

        if (archivo) {
            usuario.fotoPerfil = await subirImagen(archivo);
        }

        const { password, ...usuarioSeguro } = (await usuario.save()).toObject();

        return usuarioSeguro;
    }
}
