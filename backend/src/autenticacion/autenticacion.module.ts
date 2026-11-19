import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { AuthGuard } from './autenticacion.guard';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        if (!process.env.JWT_SECRET) {
          throw new Error('Falta la variable de entorno JWT_SECRET');
        }

        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2m' },
        };
      },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [
    AutenticacionService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AutenticacionModule {}
