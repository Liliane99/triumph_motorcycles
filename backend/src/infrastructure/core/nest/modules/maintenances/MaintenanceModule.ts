import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MaintenanceController } from "./MaintenanceController";
import { PrismaMaintenanceRepository } from "../../adapters/repositories/PrismaMaintenanceRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IMaintenanceRepository } from "../../../../../application/ports/repositories/MaintenanceRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { CreateMaintenanceUseCase } from "../../../../../application/usecases/maintenances/CreateMaintenanceUseCase";
import { UpdateMaintenanceUseCase } from "../../../../../application/usecases/maintenances/UpdateMaintenanceUseCase";
import { DeleteMaintenanceUseCase } from "../../../../../application/usecases/maintenances/DeleteMaintenanceUseCase";
import { GetMaintenanceByIdUseCase } from "../../../../../application/usecases/maintenances/GetMaintenanceByIdUseCase";
import { ListMaintenancesUseCase } from "../../../../../application/usecases/maintenances/ListMaintenancesUseCase";
import { CreateMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenances/CreateMaintenanceCommandHandler";
import { UpdateMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenances/UpdateMaintenanceCommandHandler";
import { DeleteMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenances/DeleteMaintenanceCommandHandler";
import { GetMaintenanceByIdQueryHandler } from "../../../../../application/queries/handlers/maintenances/GetMaintenanceByIdQueryHandler";
import { ListMaintenancesQueryHandler } from "../../../../../application/queries/handlers/maintenances/ListMaintenancesQueryHandler";
import { MaintenancesAccessGuard } from "../../guards/MaintenancesAccessGuard";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";

@Module({
  imports: [CqrsModule],
  controllers: [MaintenanceController],
  providers: [
    PrismaService,
    {
      provide: "IMaintenanceRepository",
      useClass: PrismaMaintenanceRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: CreateMaintenanceUseCase,
      useFactory: (maintenanceRepository: IMaintenanceRepository, eventStore: IEventPublisherService) =>
        new CreateMaintenanceUseCase(maintenanceRepository, eventStore),
      inject: ["IMaintenanceRepository", "IEventPublisherService"],
    },
    {
      provide: UpdateMaintenanceUseCase,
      useFactory: (maintenanceRepository: IMaintenanceRepository, eventStore: IEventPublisherService) =>
        new UpdateMaintenanceUseCase(maintenanceRepository, eventStore),
      inject: ["IMaintenanceRepository", "IEventPublisherService"],
    },
    {
      provide: DeleteMaintenanceUseCase,
      useFactory: (maintenanceRepository: IMaintenanceRepository, eventStore: IEventPublisherService) =>
        new DeleteMaintenanceUseCase(maintenanceRepository, eventStore),
      inject: ["IMaintenanceRepository", "IEventPublisherService"],
    },
    {
      provide: GetMaintenanceByIdUseCase,
      useFactory: (maintenanceRepository: IMaintenanceRepository) => new GetMaintenanceByIdUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    {
      provide: ListMaintenancesUseCase,
      useFactory: (maintenanceRepository: IMaintenanceRepository) => new ListMaintenancesUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    CreateMaintenanceCommandHandler,
    UpdateMaintenanceCommandHandler,
    DeleteMaintenanceCommandHandler,
    GetMaintenanceByIdQueryHandler,
    ListMaintenancesQueryHandler,
    MaintenancesAccessGuard,
  ],
  exports: ["IMaintenanceRepository", "IEventPublisherService"],
})
export class MaintenanceModule {}
