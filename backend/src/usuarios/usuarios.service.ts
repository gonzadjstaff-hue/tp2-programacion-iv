import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { RegistroDto } from '../autenticacion/dto/registro.dto';
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

    async crear(datos: RegistroDto, foto: Express.Multer.File, rol: string) {
        if (datos.password !== datos.repetirPassword) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }

        const existe = await this.usuarioModel.findOne({
            $or: [
                { email: datos.email },
                { nombreUsuario: datos.nombreUsuario },
            ],
        });

        if (existe) {
            throw new ConflictException('El email o nombre de usuario ya está registrado');
        }

        const nuevoUsuario = new this.usuarioModel({
            nombre: datos.nombre,
            apellido: datos.apellido,
            nombreUsuario: datos.nombreUsuario,
            email: datos.email,
            password: await bcrypt.hash(datos.password, 10),
            fechaNacimiento: datos.fechaNacimiento,
            descripcion: datos.descripcion,
            fotoPerfil: await subirImagen(foto),
            rol,
        });

        try {
            const { password, ...usuarioSeguro } = (await nuevoUsuario.save()).toObject();

            return usuarioSeguro;
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 11000
            ) {
                throw new ConflictException('El email o nombre de usuario ya está registrado');
            }

            throw error;
        }
    }

    async cambiarHabilitado(id: string, habilitado: boolean, adminId: string) {
        if (!habilitado && id === adminId) {
            throw new BadRequestException('No podés deshabilitar tu propia cuenta');
        }

        const usuario = isValidObjectId(id)
            ? await this.usuarioModel
                .findByIdAndUpdate(id, { habilitado }, { returnDocument: 'after' })
                .select('-password')
            : null;

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async actualizar(id: string, usuarioId: string, datos: ActualizarUsuarioDto, archivo?: Express.Multer.File) {
        if (usuarioId !== id) {
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
