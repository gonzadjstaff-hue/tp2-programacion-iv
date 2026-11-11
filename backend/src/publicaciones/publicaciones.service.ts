import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Publicacion } from './schemas/publicacion.schema';
import { Comentario } from './schemas/comentario.schema';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { subirImagen } from '../imagenes';

@Injectable()
export class PublicacionesService {
    constructor(
        @InjectModel(Publicacion.name)
        private publicacionModel: Model<Publicacion>,
        @InjectModel(Comentario.name)
        private comentarioModel: Model<Comentario>,
        @InjectModel(Usuario.name)
        private usuarioModel: Model<Usuario>,
    ) { }

    async crear(datos: CrearPublicacionDto, archivo?: Express.Multer.File) {
        await this.buscarUsuario(datos.usuarioId);

        return this.publicacionModel.create({
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            imagen: archivo ? await subirImagen(archivo) : undefined,
            usuario: datos.usuarioId,
        });
    }

    async listar(filtros: ListarPublicacionesDto) {
        const condicion: Record<string, unknown> = { activa: true };

        if (filtros.usuario) {
            condicion.usuario = filtros.usuario;
        }

        const orden: Record<string, 1 | -1> =
            filtros.orden === 'meGusta'
                ? { cantidadMeGusta: -1, createdAt: -1 }
                : { createdAt: -1 };

        const publicaciones = await this.publicacionModel
            .find(condicion)
            .sort(orden)
            .skip(filtros.offset ?? 0)
            .limit(filtros.limit ?? 10)
            .populate('usuario', 'nombreUsuario fotoPerfil');

        const total = await this.publicacionModel.countDocuments(condicion);

        return { publicaciones, total };
    }

    async eliminar(id: string, usuarioId: string) {
        const publicacion = await this.buscarPublicacion(id);
        const usuario = await this.buscarUsuario(usuarioId);

        const esAutor = publicacion.usuario.toString() === usuarioId;

        if (!esAutor && usuario.rol !== 'administrador') {
            throw new ForbiddenException('Solo el autor o un administrador puede eliminar la publicación');
        }

        publicacion.activa = false;
        await publicacion.save();

        return { mensaje: 'Publicación eliminada' };
    }

    async darMeGusta(id: string, usuarioId: string) {
        const publicacion = await this.buscarPublicacion(id);
        await this.buscarUsuario(usuarioId);

        if (publicacion.meGusta.some((meGusta) => meGusta.toString() === usuarioId)) {
            throw new ConflictException('Ya le diste me gusta a esta publicación');
        }

        await this.publicacionModel.updateOne(
            { _id: id, meGusta: { $ne: usuarioId } },
            { $push: { meGusta: usuarioId }, $inc: { cantidadMeGusta: 1 } },
        );

        return { mensaje: 'Me gusta agregado' };
    }

    async quitarMeGusta(id: string, usuarioId: string) {
        const publicacion = await this.buscarPublicacion(id);

        if (!publicacion.meGusta.some((meGusta) => meGusta.toString() === usuarioId)) {
            throw new BadRequestException('No le habías dado me gusta a esta publicación');
        }

        await this.publicacionModel.updateOne(
            { _id: id, meGusta: usuarioId },
            { $pull: { meGusta: usuarioId }, $inc: { cantidadMeGusta: -1 } },
        );

        return { mensaje: 'Me gusta quitado' };
    }

    async listarComentarios(id: string) {
        await this.buscarPublicacion(id);

        return this.comentarioModel
            .find({ publicacion: id })
            .sort({ createdAt: -1 })
            .populate('usuario', 'nombreUsuario');
    }

    private async buscarPublicacion(id: string) {
        const publicacion = isValidObjectId(id)
            ? await this.publicacionModel.findOne({ _id: id, activa: true })
            : null;

        if (!publicacion) {
            throw new NotFoundException('Publicación no encontrada');
        }

        return publicacion;
    }

    private async buscarUsuario(id: string) {
        const usuario = await this.usuarioModel.findById(id);

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }
}
