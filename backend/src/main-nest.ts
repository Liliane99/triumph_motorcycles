import { NestFactory } from '@nestjs/core';
import { AppModule } from './interface/nest/app.module';
import { NotFoundFilter } from './interface/shared/filters/not-Found.fitler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(3000);
  console.log('NestJS server running on http://localhost:3000');
}
bootstrap();
