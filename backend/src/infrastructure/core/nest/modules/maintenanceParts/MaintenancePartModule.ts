import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MaintenancePartController } from "./MaintenancePartController";
import { PrismaMaintenancePartRepository } from "../../adapters/repositories/PrismaMaintenancePartRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IMaintenancePartRepository } from "../../../../../application/ports/repositories/MaintenancePartRepository";
import { IMaintenanceRepository } from "../../../../../application/ports/repositories/MaintenanceRepository";
import { IPartRepository } from "../../../../../application/ports/repositories/PartRepository";
import { PrismaMaintenanceRepository } from "../../adapters/repositories/PrismaMaintenanceRepository";
import { PrismaPartRepository } from "../../adapters/repositories/PrismaPartRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { MaintenancesPartsAccessGuard } from "../../guards/MaintenancesPartsAccessGuard";
import { AddPartToMaintenanceUseCase } from "../../../../../application/usecases/maintenanceParts/AddPartToMaintenanceUseCase";
import { UpdatePartInMaintenanceUseCase } from "../../../../../application/usecases/maintenanceParts/UpdatePartInMaintenanceUseCase";
import { RemovePartFromMaintenanceUseCase } from "../../../../../application/usecases/maintenanceParts/RemovePartFromMaintenanceUseCase";
import { GetMaintenancePartsUseCase } from "../../../../../application/usecases/maintenanceParts/GetMaintenancePartsUseCase";
import { AddPartToMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenanceParts/AddPartToMaintenanceCommandHandler";
import { UpdatePartInMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenanceParts/UpdatePartInMaintenanceCommandHandler";
import { RemovePartFromMaintenanceCommandHandler } from "../../../../../application/commands/handlers/maintenanceParts/RemovePartFromMaintenanceCommandHandler";
import { GetMaintenancePartsQueryHandler } from "../../../../../application/queries/handlers/maintenanceParts/GetMaintenancePartsQueryHandler";

@Module({
  imports: [CqrsModule],
  controllers: [MaintenancePartController],
  providers: [
    PrismaService,
    {
      provide: "IMaintenanceRepository",
      useClass: PrismaMaintenanceRepository,
    },
    {
      provide: "IPartRepository",
      useClass: PrismaPartRepository,
    },
    {
      provide: "IMaintenancePartRepository",
      useClass: PrismaMaintenancePartRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: AddPartToMaintenanceUseCase,
      useFactory: (
        maintenanceRepository: IMaintenanceRepository,
        maintenancePartRepository: IMaintenancePartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new AddPartToMaintenanceUseCase(maintenanceRepository, maintenancePartRepository, partRepository, eventStore),
      inject: ["IMaintenanceRepository", "IMaintenancePartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: UpdatePartInMaintenanceUseCase,
      useFactory: (
        maintenanceRepository: IMaintenanceRepository,
        maintenancePartRepository: IMaintenancePartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new UpdatePartInMaintenanceUseCase(maintenanceRepository, maintenancePartRepository, partRepository, eventStore),
      inject: ["IMaintenanceRepository", "IMaintenancePartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: RemovePartFromMaintenanceUseCase,
      useFactory: (
        maintenanceRepository: IMaintenanceRepository,
        maintenancePartRepository: IMaintenancePartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new RemovePartFromMaintenanceUseCase(maintenanceRepository, maintenancePartRepository, partRepository, eventStore),
      inject: ["IMaintenanceRepository", "IMaintenancePartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: GetMaintenancePartsUseCase,
      useFactory: (maintenancePartRepository: IMaintenancePartRepository) =>
        new GetMaintenancePartsUseCase(maintenancePartRepository),
      inject: ["IMaintenancePartRepository"],
    },

    AddPartToMaintenanceCommandHandler,
    UpdatePartInMaintenanceCommandHandler,
    RemovePartFromMaintenanceCommandHandler,
    GetMaintenancePartsQueryHandler,
    MaintenancesPartsAccessGuard,
  ],
  exports: ["IMaintenancePartRepository", "IEventPublisherService"],
})
export class MaintenancePartModule {}
