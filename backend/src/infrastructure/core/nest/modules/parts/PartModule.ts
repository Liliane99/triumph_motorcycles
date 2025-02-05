import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PartController } from "./PartController";
import { PrismaPartRepository } from "../../adapters/repositories/PrismaPartRepository";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IPartRepository } from "../../../../../application/ports/repositories/PartRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { IEmailService } from "../../../../../application/ports/services/IEmailService";
import { BrevoEmailService } from "../../adapters/services/BrevoEmailService";
import { CreatePartUseCase } from "../../../../../application/usecases/parts/CreatePartUseCase";
import { UpdatePartUseCase } from "../../../../../application/usecases/parts/UpdatePartUseCase";
import { DeletePartUseCase } from "../../../../../application/usecases/parts/DeletePartUseCase";
import { GetPartByIdUseCase } from "../../../../../application/usecases/parts/GetPartByIdUseCase";
import { ListPartsUseCase } from "../../../../../application/usecases/parts/ListPartsUseCase";
import { CreatePartCommandHandler } from "../../../../../application/commands/handlers/parts/CreatePartCommandHandler";
import { UpdatePartCommandHandler } from "../../../../../application/commands/handlers/parts/UpdatePartCommandHandler";
import { DeletePartCommandHandler } from "../../../../../application/commands/handlers/parts/DeletePartCommandHandler";
import { GetPartByIdQueryHandler } from "../../../../../application/queries/handlers/parts/GetPartByIdQueryHandler";
import { ListPartsQueryHandler } from "../../../../../application/queries/handlers/parts/ListPartsQueryHandler";
import { IUserRepository } from "../../../../../application/ports/repositories/UserRepository";
import { PrismaUserRepository } from "../../adapters/repositories/PrismaUserRepository";


@Module({
  imports: [CqrsModule],
  controllers: [PartController],
  providers: [
    PrismaService,
    {
      provide: "IPartRepository",
      useClass: PrismaPartRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: "IEmailService",
      useClass: BrevoEmailService,
    },
    {
      provide: "IUserRepository",
      useClass: PrismaUserRepository,
    },

    {
      provide: CreatePartUseCase,
      useFactory: (partRepository: IPartRepository, eventStore: IEventPublisherService) =>
        new CreatePartUseCase(partRepository, eventStore),
      inject: ["IPartRepository", "IEventPublisherService"],
    },
    {
      provide: UpdatePartUseCase,
      useFactory: (
        partRepository: IPartRepository,
        userRepository: IUserRepository, 
        eventStore: IEventPublisherService,
        emailService: IEmailService
      ) => new UpdatePartUseCase(partRepository, userRepository, eventStore, emailService),
      inject: ["IPartRepository", "IUserRepository", "IEventPublisherService", "IEmailService"], 
    },
    {
      provide: DeletePartUseCase,
      useFactory: (partRepository: IPartRepository, eventStore: IEventPublisherService) =>
        new DeletePartUseCase(partRepository, eventStore),
      inject: ["IPartRepository", "IEventPublisherService"],
    },
    {
      provide: GetPartByIdUseCase,
      useFactory: (partRepository: IPartRepository) => new GetPartByIdUseCase(partRepository),
      inject: ["IPartRepository"],
    },
    {
      provide: ListPartsUseCase,
      useFactory: (partRepository: IPartRepository) => new ListPartsUseCase(partRepository),
      inject: ["IPartRepository"],
    },

    CreatePartCommandHandler,
    UpdatePartCommandHandler,
    DeletePartCommandHandler,
    GetPartByIdQueryHandler,
    ListPartsQueryHandler,
  ],
  exports: ["IPartRepository", "IEventPublisherService", "IEmailService"],
})
export class PartModule {}
