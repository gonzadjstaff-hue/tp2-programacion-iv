import {
    Injectable,
    BadRequestException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { subirImagen } from '../imagenes';

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: Model<Usuario>,
        private jwtService: JwtService,
    ) { }

    private async crearSesion(usuario: { _id: unknown; rol: string }) {
        const token = await this.jwtService.signAsync({
            sub: String(usuario._id),
            rol: usuario.rol,
        });

        return { token, usuario };
    }

    async autorizar(usuarioId: string) {
        const usuario = await this.usuarioModel.findById(usuarioId).select('-password');

        if (!usuario) {
            throw new UnauthorizedException('El usuario ya no existe');
        }

        return usuario;
    }

    async refrescar(usuarioId: string, rol: string) {
        const token = await this.jwtService.signAsync({ sub: usuarioId, rol });

        return { token };
    }

    async registrar(datos: RegistroDto, foto: Express.Multer.File) {
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
            throw new ConflictException(
                'El email o nombre de usuario ya está registrado',
            );
        }

        const passwordHash = await bcrypt.hash(datos.password, 10);
        const fotoPerfil = await subirImagen(foto);

        const nuevoUsuario = new this.usuarioModel({
            nombre: datos.nombre,
            apellido: datos.apellido,
            nombreUsuario: datos.nombreUsuario,
            email: datos.email,
            password: passwordHash,
            fechaNacimiento: datos.fechaNacimiento,
            descripcion: datos.descripcion,
            fotoPerfil,
            rol: 'usuario',
        });

        try {
            const usuarioGuardado = await nuevoUsuario.save();

            const usuario = usuarioGuardado.toObject();
            const { password, ...datosSeguros } = usuario;

            return this.crearSesion(datosSeguros);
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 11000
            ) {
                throw new ConflictException(
                    'El email o nombre de usuario ya está registrado',
                );
            }

            throw error;
        }
    }
    async login(datos: LoginDto) {
        const usuario = await this.usuarioModel.findOne({
            $or: [
                { email: datos.identificador },
                { nombreUsuario: datos.identificador },
            ],
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const passwordValida = await bcrypt.compare(datos.password, usuario.password);

        if (!passwordValida) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        
        const { password, ...usuarioSeguro } = usuario.toObject();
        
        return this.crearSesion(usuarioSeguro);
    }
}