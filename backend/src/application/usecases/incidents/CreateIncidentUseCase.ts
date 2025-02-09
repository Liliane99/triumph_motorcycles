import { IIncidentRepository } from "../../ports/repositories/IncidentRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { CreateIncidentCommand } from "../../commands/definitions/incidents/CreateIncidentCommand";
import { IncidentCreatedEvent } from "../../../domain/events/incidents/IncidentCreatedEvent";
import { Incident } from "../../../domain/entities/Incident";
import { IncidentReferenceAlreadyExistsError } from "../../../domain/errors/incidents/IncidentReferenceAlreadyExistsError";

export class CreateIncidentUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: CreateIncidentCommand): Promise<void> {
    const existingIncident = await this.incidentRepository.getIncidentByReference(command.reference);
    if (existingIncident) {
      throw new IncidentReferenceAlreadyExistsError(command.reference);
    }

    const incident = Incident.create(
      command.id,
      command.reference,
      command.description,
      command.motorcycleId,
      command.createdBy
    );

    if (incident instanceof Error) {
      throw incident;
    }

    await this.incidentRepository.createIncident(incident);

    const event: IncidentCreatedEvent = {
      identifier: incident.id,
      type: "INCIDENT_CREATED",
      date: new Date(),
      version: 1,
      data: {
        id: incident.id,
        reference: incident.reference.value,
        description: incident.description.value,
        status: incident.status.value,
        date: incident.date.value,
        motorcycleId: incident.motorcycleId,
        createdAt: incident.createdAt,
        createdBy: incident.createdBy
      }
    };

    await this.eventStore.publish(event, `incident-${incident.id}`);
  }
}
