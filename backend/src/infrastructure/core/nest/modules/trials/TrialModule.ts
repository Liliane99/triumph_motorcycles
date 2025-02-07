import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TrialController } from "./TrialController";
import { PrismaTrialRepository } from "../../adapters/repositories/PrismaTrialRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { ITrialRepository } from "../../../../../application/ports/repositories/TrialRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { TrialsAccessGuard } from "../../guards/TrialsAccessGuard";

import { CreateTrialUseCase } from "../../../../../application/usecases/trials/CreateTrialUseCase";
import { UpdateTrialUseCase } from "../../../../../application/usecases/trials/UpdateTrialUseCase";
import { DeleteTrialUseCase } from "../../../../../application/usecases/trials/DeleteTrialUseCase";
import { GetTrialByIdUseCase } from "../../../../../application/usecases/trials/GetTrialByIdUseCase";
import { ListTrialsUseCase } from "../../../../../application/usecases/trials/ListTrialsUseCase";

import { CreateTrialCommandHandler } from "../../../../../application/commands/handlers/trials/CreateTrialCommandHandler";
import { UpdateTrialCommandHandler } from "../../../../../application/commands/handlers/trials/UpdateTrialCommandHandler";
import { DeleteTrialCommandHandler } from "../../../../../application/commands/handlers/trials/DeleteTrialCommandHandler";
import { GetTrialByIdQueryHandler } from "../../../../../application/queries/handlers/trials/GetTrialByIdQueryHandler";
import { ListTrialsQueryHandler } from "../../../../../application/queries/handlers/trials/ListTrialsQueryHandler";

import { IUserRepository } from "../../../../../application/ports/repositories/UserRepository";
import { MotorcycleRepository } from "../../../../../application/ports/repositories/MotorcycleRepository";
import { PrismaUserRepository } from "../../adapters/repositories/PrismaUserRepository";
import { MotorcycleRepositoryImpl } from "../../../express/repositories/MotorcycleRepository";

@Module({
  imports: [CqrsModule],
  controllers: [TrialController],
  providers: [
    PrismaService,
    {
      provide: "ITrialRepository",
      useClass: PrismaTrialRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
        provide: "IUserRepository",
        useClass: PrismaUserRepository,
    },
    {
        provide: "MotorcycleRepository",
        useClass: MotorcycleRepositoryImpl, 
    },
    {
        provide: CreateTrialUseCase,
        useFactory: (trialRepository: ITrialRepository,userRepository: IUserRepository,motorcycleRepository: MotorcycleRepository, eventStore: IEventPublisherService) =>
            new CreateTrialUseCase(trialRepository, userRepository, motorcycleRepository, eventStore),
        inject: ["ITrialRepository", "IUserRepository", "MotorcycleRepository", "IEventPublisherService"],
    },
    {
      provide: UpdateTrialUseCase,
      useFactory: (trialRepository: ITrialRepository, eventStore: IEventPublisherService) =>
        new UpdateTrialUseCase(trialRepository, eventStore),
      inject: ["ITrialRepository", "IEventPublisherService"],
    },
    {
      provide: DeleteTrialUseCase,
      useFactory: (trialRepository: ITrialRepository, eventStore: IEventPublisherService) =>
        new DeleteTrialUseCase(trialRepository, eventStore),
      inject: ["ITrialRepository", "IEventPublisherService"],
    },
    {
      provide: GetTrialByIdUseCase,
      useFactory: (trialRepository: ITrialRepository) => new GetTrialByIdUseCase(trialRepository),
      inject: ["ITrialRepository"],
    },
    {
      provide: ListTrialsUseCase,
      useFactory: (trialRepository: ITrialRepository) => new ListTrialsUseCase(trialRepository),
      inject: ["ITrialRepository"],
    },

    CreateTrialCommandHandler,
    UpdateTrialCommandHandler,
    DeleteTrialCommandHandler,
    GetTrialByIdQueryHandler,
    ListTrialsQueryHandler,
    TrialsAccessGuard,
  ],
  exports: ["ITrialRepository", "IEventPublisherService"],
})
export class TrialModule {}
