import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);