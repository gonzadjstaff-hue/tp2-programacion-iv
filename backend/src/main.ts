import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dns from 'node:dns';

async function bootstrap() {
  dns.setServers(['8.8.8.8']);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
