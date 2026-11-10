import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import * as dns from 'node:dns';
import { AppModule } from './app.module';

async function bootstrap() {
  dns.setServers(['8.8.8.8']);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
  });
  
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, transform: true }));

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();