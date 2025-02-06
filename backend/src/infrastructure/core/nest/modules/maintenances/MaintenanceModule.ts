import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MaintenanceController } from "./MaintenanceController";
import { MaintenanceRepositoryImpl } from "../../adapters/repositories/PrismaMaintenanceRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { MaintenanceRepository } from "../../../../../application/ports/repositories/MaintenanceRepository";
import { MotorcycleRepositoryImpl } from "../../../express/repositories/MotorcycleRepository";  
import { PrismaPartRepository } from "../../adapters/repositories/PrismaPartRepository"; 
import { IPartRepository } from "../../../../../application/ports/repositories/PartRepository";  
import { MotorcycleRepository } from "../../../../../application/ports/repositories/MotorcycleRepository"; 

import { CreateMaintenanceUseCase } from "../../../../../application/usecases/Maintenance/AddMaintenanceUseCase";
import { UpdateMaintenanceUseCase } from "../../../../../application/usecases/Maintenance/UpdateMaintenanceUseCase";
import { DeleteMaintenanceUseCase } from "../../../../../application/usecases/Maintenance/DeleteMaintenanceUseCase";
import { GetMaintenanceUseCase } from "../../../../../application/usecases/Maintenance/GetMaintenanceUseCase";
import { GetAllMaintenanceUseCase } from "../../../../../application/usecases/Maintenance/GetAllMaintenanceUseCase";

import { CreateMaintenanceHandler } from "../../../../../application/commands/handlers/Maintenance/AddMaintenanceHandler";
import { UpdateMaintenanceHandler } from "../../../../../application/commands/handlers/Maintenance/UpdateMaintenanceHandler";
import { DeleteMaintenanceHandler } from "../../../../../application/commands/handlers/Maintenance/DeleteMaintenanceHandler";

import { GetMaintenanceHandler } from "../../../../../application/queries/handlers/Maintenance/GetMaintenanceHandler";
import { GetAllMaintenanceHandler } from "../../../../../application/queries/handlers/Maintenance/GetAllMaintenanceHandler";

@Module({
  imports: [CqrsModule],
  controllers: [MaintenanceController],
  providers: [
    PrismaService,
    {
      provide: "IMaintenanceRepository",
      useClass: MaintenanceRepositoryImpl,
    },
    {
      provide: "IMotorcycleRepository", 
      useClass: MotorcycleRepositoryImpl, 
    },
    {
      provide: "IPartRepository", 
      useClass: PrismaPartRepository, 
    },
    {
      provide: CreateMaintenanceUseCase,
      useFactory: (
        maintenanceRepository: MaintenanceRepository,
        motorcycleRepository: MotorcycleRepository,
        partRepository: IPartRepository
      ) =>
        new CreateMaintenanceUseCase(maintenanceRepository, motorcycleRepository, partRepository),
      inject: ["IMaintenanceRepository", "IMotorcycleRepository", "IPartRepository"],
    },
    {
      provide: UpdateMaintenanceUseCase,
      useFactory: (maintenanceRepository: MaintenanceRepository) =>
        new UpdateMaintenanceUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    {
      provide: DeleteMaintenanceUseCase,
      useFactory: (maintenanceRepository: MaintenanceRepository) =>
        new DeleteMaintenanceUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    {
      provide: GetMaintenanceUseCase,
      useFactory: (maintenanceRepository: MaintenanceRepository) =>
        new GetMaintenanceUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    {
      provide: GetAllMaintenanceUseCase,
      useFactory: (maintenanceRepository: MaintenanceRepository) =>
        new GetAllMaintenanceUseCase(maintenanceRepository),
      inject: ["IMaintenanceRepository"],
    },
    CreateMaintenanceHandler,
    UpdateMaintenanceHandler,
    DeleteMaintenanceHandler,
    GetMaintenanceHandler,
    GetAllMaintenanceHandler,
  ],
  exports: ["IMaintenanceRepository", "IMotorcycleRepository", "IPartRepository"],
})
export class MaintenanceModule {}