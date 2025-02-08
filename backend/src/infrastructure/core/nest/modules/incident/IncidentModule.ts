import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IncidentController } from "./IncidentController";
import { IncidentRepositoryImpl } from "../../adapters/repositories/PrismaIncidentRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IncidentRepository } from "../../../../../application/ports/repositories/IncidentRepository";
import { MotorcycleRepositoryImpl } from "../../../express/repositories/MotorcycleRepository";  
import { MotorcycleRepository } from "../../../../../application/ports/repositories/MotorcycleRepository"; 

import { CreateIncidentUseCase } from "../../../../../application/usecases/Incident/AddIncidentUseCase";
import { UpdateIncidentUseCase } from "../../../../../application/usecases/Incident/UpdateIncidentUseCase";
import { DeleteIncidentUseCase } from "../../../../../application/usecases/Incident/DeleteIncidentUseCase";
import { GetIncidentUseCase } from "../../../../../application/usecases/Incident/GetIncidentUseCase";
import { GetAllIncidentUseCase } from "../../../../../application/usecases/Incident/GetAllIncidentUseCase";

import { CreateIncidentHandler } from "../../../../../application/commands/handlers/Incident/AddIncidentHandler";
import { UpdateIncidentHandler } from "../../../../../application/commands/handlers/Incident/UpdateIncidentHandler";
import { DeleteIncidentHandler } from "../../../../../application/commands/handlers/Incident/DeleteIncidentHandler";

import { GetIncidentHandler } from "../../../../../application/queries/handlers/Incident/GetIncidentHandler";
import { GetAllIncidentsHandler } from "../../../../../application/queries/handlers/Incident/GetAllIncidentHandler";

@Module({
  imports: [CqrsModule], 
  controllers: [IncidentController], 
  providers: [
    PrismaService, 
    
    {
      provide: "IIncidentRepository",
      useClass: IncidentRepositoryImpl, 
    },
    {
      provide: "IMotorcycleRepository", 
      useClass: MotorcycleRepositoryImpl, 
    },

    {
      provide: CreateIncidentUseCase,
      useFactory: (
        incidentRepository: IncidentRepository,
        motorcycleRepository: MotorcycleRepository
      ) =>
        new CreateIncidentUseCase(incidentRepository, motorcycleRepository),
      inject: ["IIncidentRepository", "IMotorcycleRepository"],
    },
    {
      provide: UpdateIncidentUseCase,
      useFactory: (incidentRepository: IncidentRepository) =>
        new UpdateIncidentUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },
    {
      provide: DeleteIncidentUseCase,
      useFactory: (incidentRepository: IncidentRepository) =>
        new DeleteIncidentUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },
    {
      provide: GetIncidentUseCase,
      useFactory: (incidentRepository: IncidentRepository) =>
        new GetIncidentUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },
    {
      provide: GetAllIncidentUseCase,
      useFactory: (incidentRepository: IncidentRepository) =>
        new GetAllIncidentUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },

    {
      provide: GetIncidentHandler,
      useFactory: (incidentRepository: IncidentRepository) =>
        new GetIncidentHandler(incidentRepository),
      inject: ["IIncidentRepository"],
    },
    {
      provide: GetAllIncidentsHandler,
      useFactory: (incidentRepository: IncidentRepository) =>
        new GetAllIncidentsHandler(incidentRepository),
      inject: ["IIncidentRepository"],
    },

    CreateIncidentHandler,
    UpdateIncidentHandler,
    DeleteIncidentHandler,
  ],
  exports: ["IIncidentRepository", "IMotorcycleRepository"], 
  
})
export class IncidentModule {}
