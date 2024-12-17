// src/interface/nest/app.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppController } from './app.controller';

@Module({
  controllers: [UserController, AppController],
})
export class AppModule {}
