import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(); 
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks() {
    process.on("SIGINT", async () => {
      await this.$disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await this.$disconnect();
      process.exit(0);
    });
  }
}
