import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.MONGO_URI ?? '' }) }),
    UsuariosModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
