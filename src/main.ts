import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP } from '../config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(APP.port);
}
bootstrap();
