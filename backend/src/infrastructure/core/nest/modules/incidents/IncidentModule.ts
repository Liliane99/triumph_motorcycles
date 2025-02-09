import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { IncidentController } from "./IncidentController";
import { PrismaIncidentRepository } from "../../adapters/repositories/PrismaIncidentRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IIncidentRepository } from "../../../../../application/ports/repositories/IncidentRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { IncidentsAccessGuard } from "../../guards/IncidentsAccessGuard";
import { CreateIncidentUseCase } from "../../../../../application/usecases/incidents/CreateIncidentUseCase";
import { UpdateIncidentUseCase } from "../../../../../application/usecases/incidents/UpdateIncidentUseCase";
import { DeleteIncidentUseCase } from "../../../../../application/usecases/incidents/DeleteIncidentUseCase";
import { GetIncidentByIdUseCase } from "../../../../../application/usecases/incidents/GetIncidentByIdUseCase";
import { ListIncidentsUseCase } from "../../../../../application/usecases/incidents/ListIncidentsUseCase";
import { CreateIncidentCommandHandler } from "../../../../../application/commands/handlers/incidents/CreateIncidentCommandHandler";
import { UpdateIncidentCommandHandler } from "../../../../../application/commands/handlers/incidents/UpdateIncidentCommandHandler";
import { DeleteIncidentCommandHandler } from "../../../../../application/commands/handlers/incidents/DeleteIncidentCommandHandler";
import { GetIncidentByIdQueryHandler } from "../../../../../application/queries/handlers/incidents/GetIncidentByIdQueryHandler";
import { ListIncidentsQueryHandler } from "../../../../../application/queries/handlers/incidents/ListIncidentsQueryHandler";

@Module({
  imports: [CqrsModule],
  controllers: [IncidentController],
  providers: [
    PrismaService,
    {
      provide: "IIncidentRepository",
      useClass: PrismaIncidentRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: CreateIncidentUseCase,
      useFactory: (incidentRepository: IIncidentRepository, eventStore: IEventPublisherService) =>
        new CreateIncidentUseCase(incidentRepository, eventStore),
      inject: ["IIncidentRepository", "IEventPublisherService"],
    },
    {
      provide: UpdateIncidentUseCase,
      useFactory: (incidentRepository: IIncidentRepository, eventStore: IEventPublisherService) =>
        new UpdateIncidentUseCase(incidentRepository, eventStore),
      inject: ["IIncidentRepository", "IEventPublisherService"],
    },
    {
      provide: DeleteIncidentUseCase,
      useFactory: (incidentRepository: IIncidentRepository, eventStore: IEventPublisherService) =>
        new DeleteIncidentUseCase(incidentRepository, eventStore),
      inject: ["IIncidentRepository", "IEventPublisherService"],
    },
    {
      provide: GetIncidentByIdUseCase,
      useFactory: (incidentRepository: IIncidentRepository) => new GetIncidentByIdUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },
    {
      provide: ListIncidentsUseCase,
      useFactory: (incidentRepository: IIncidentRepository) => new ListIncidentsUseCase(incidentRepository),
      inject: ["IIncidentRepository"],
    },

    CreateIncidentCommandHandler,
    UpdateIncidentCommandHandler,
    DeleteIncidentCommandHandler,
    GetIncidentByIdQueryHandler,
    ListIncidentsQueryHandler,
    IncidentsAccessGuard,
  ],
  exports: ["IIncidentRepository", "IEventPublisherService"],
})
export class IncidentModule {}
