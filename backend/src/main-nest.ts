import { NestFactory } from '@nestjs/core';
import { AppModule } from './interface/nest/app.module';
import { NotFoundFilter } from './interface/shared/filters/not-found';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(4001);
  console.log('NestJS server running on http://localhost:4001');
}
bootstrap();
