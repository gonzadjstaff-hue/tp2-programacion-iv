import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(Usuario.name)
        private usuarioModel: Model<Usuario>,
        private jwtService: JwtService,
        private usuariosService: UsuariosService,
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

        if (!usuario.habilitado) {
            throw new UnauthorizedException('Tu cuenta está deshabilitada');
        }

        return usuario;
    }

    async refrescar(usuarioId: string, rol: string) {
        await this.autorizar(usuarioId);

        const token = await this.jwtService.signAsync({ sub: usuarioId, rol });

        return { token };
    }

    async registrar(datos: RegistroDto, foto: Express.Multer.File) {
        if (datos.rol && datos.rol !== 'usuario') {
            throw new BadRequestException('No se puede elegir el rol al registrarse');
        }

        const usuario = await this.usuariosService.crear(datos, foto, 'usuario');

        return this.crearSesion(usuario);
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
        
        if (!usuario.habilitado) {
            throw new ForbiddenException(
                'Tu cuenta está deshabilitada. No estás autorizado para ingresar a la aplicación',
            );
        }

        const { password, ...usuarioSeguro } = usuario.toObject();
        
        return this.crearSesion(usuarioSeguro);
    }
}