import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP } from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  await app.listen(APP.port);
}
bootstrap();
