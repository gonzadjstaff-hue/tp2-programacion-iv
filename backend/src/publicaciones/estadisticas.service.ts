import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './schemas/publicacion.schema';
import { Comentario } from './schemas/comentario.schema';
import { RangoFechasDto } from './dto/rango-fechas.dto';

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectModel(Publicacion.name)
        private publicacionModel: Model<Publicacion>,
        @InjectModel(Comentario.name)
        private comentarioModel: Model<Comentario>,
    ) { }

    async publicacionesPorUsuario(rango: RangoFechasDto) {
        return this.publicacionModel.aggregate([
            { $match: { activa: true, ...this.filtroFecha(rango) } },
            { $group: { _id: '$usuario', cantidad: { $sum: 1 } } },
            { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
            { $unwind: '$usuario' },
            { $project: { _id: 0, usuario: '$usuario.nombreUsuario', cantidad: 1 } },
            { $sort: { cantidad: -1 } },
        ]);
    }

    async comentariosPorDia(rango: RangoFechasDto) {
        return this.comentarioModel.aggregate([
            { $match: this.filtroFecha(rango) },
            { $lookup: { from: 'publicacions', localField: 'publicacion', foreignField: '_id', as: 'publicacion' } },
            { $match: { 'publicacion.activa': true } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, cantidad: { $sum: 1 } } },
            { $project: { _id: 0, fecha: '$_id', cantidad: 1 } },
            { $sort: { fecha: 1 } },
        ]);
    }

    async comentariosPorPublicacion(rango: RangoFechasDto) {
        return this.comentarioModel.aggregate([
            { $match: this.filtroFecha(rango) },
            { $group: { _id: '$publicacion', cantidad: { $sum: 1 } } },
            { $lookup: { from: 'publicacions', localField: '_id', foreignField: '_id', as: 'publicacion' } },
            { $unwind: '$publicacion' },
            { $match: { 'publicacion.activa': true } },
            { $project: { _id: 0, publicacion: '$publicacion.titulo', cantidad: 1 } },
            { $sort: { cantidad: -1 } },
        ]);
    }

    private filtroFecha(rango: RangoFechasDto) {
        const createdAt: { $gte?: Date; $lte?: Date } = {};

        if (rango.desde) {
            createdAt.$gte = new Date(rango.desde);
        }

        if (rango.hasta) {
            const hasta = new Date(rango.hasta);

            if (rango.hasta.length === 10) {
                hasta.setUTCHours(23, 59, 59, 999);
            }

            createdAt.$lte = hasta;
        }

        if (createdAt.$gte && createdAt.$lte && createdAt.$gte > createdAt.$lte) {
            throw new BadRequestException('La fecha desde no puede ser posterior a la fecha hasta');
        }

        return Object.keys(createdAt).length ? { createdAt } : {};
    }
}
