// src/main-nest.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interface/nest/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('NestJS server running on http://localhost:3000');
}
bootstrap();
