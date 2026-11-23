import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Publicacion } from './schemas/publicacion.schema';
import { Comentario } from './schemas/comentario.schema';
import { ComentarioDto } from './dto/comentario.dto';
import { ListarComentariosDto } from './dto/listar-comentarios.dto';

@Injectable()
export class ComentariosService {
    constructor(
        @InjectModel(Publicacion.name)
        private publicacionModel: Model<Publicacion>,
        @InjectModel(Comentario.name)
        private comentarioModel: Model<Comentario>,
    ) { }

    async listar(publicacionId: string, filtros: ListarComentariosDto) {
        await this.buscarPublicacion(publicacionId);

        const comentarios = await this.comentarioModel
            .find({ publicacion: publicacionId })
            .sort({ createdAt: -1 })
            .skip(filtros.offset ?? 0)
            .limit(filtros.limit ?? 5)
            .populate('usuario', 'nombreUsuario fotoPerfil');

        const total = await this.comentarioModel.countDocuments({ publicacion: publicacionId });

        return { comentarios, total };
    }

    async crear(publicacionId: string, usuarioId: string, datos: ComentarioDto) {
        await this.buscarPublicacion(publicacionId);

        const comentario = await this.comentarioModel.create({
            publicacion: publicacionId,
            usuario: usuarioId,
            mensaje: datos.mensaje,
        });

        return comentario.populate('usuario', 'nombreUsuario fotoPerfil');
    }

    async modificar(publicacionId: string, comentarioId: string, usuarioId: string, datos: ComentarioDto) {
        await this.buscarPublicacion(publicacionId);

        const comentario = isValidObjectId(comentarioId)
            ? await this.comentarioModel.findOne({ _id: comentarioId, publicacion: publicacionId })
            : null;

        if (!comentario) {
            throw new NotFoundException('Comentario no encontrado');
        }

        if (comentario.usuario.toString() !== usuarioId) {
            throw new ForbiddenException('Solo podés editar tus propios comentarios');
        }

        comentario.mensaje = datos.mensaje;
        comentario.modificado = true;
        await comentario.save();

        return comentario.populate('usuario', 'nombreUsuario fotoPerfil');
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
}
