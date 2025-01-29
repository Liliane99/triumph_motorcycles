import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/AppModule";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();           
  app.use(helmet());          
  app.useGlobalPipes(new ValidationPipe());  

  const PORT = process.env.PORT || 4001;
  await app.listen(PORT);
  console.log(`NestJS API is running on http://localhost:${PORT}`);
}

bootstrap();

