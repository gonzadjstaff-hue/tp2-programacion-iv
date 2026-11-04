import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true })
  nombreUsuario!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fechaNacimiento!: string;

  @Prop()
  descripcion?: string;

  @Prop()
  fotoPerfil?: string;

  @Prop({ default: 'usuario' })
  rol!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);