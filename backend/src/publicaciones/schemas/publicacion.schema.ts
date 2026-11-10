import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  descripcion!: string;

  @Prop()
  imagen?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true })
  usuario!: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }], default: [] })
  meGusta!: Types.ObjectId[];

  @Prop({ default: 0 })
  cantidadMeGusta!: number;

  @Prop({ default: true })
  activa!: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
