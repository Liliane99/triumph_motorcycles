import { IIncidentRepository } from "../../ports/repositories/IncidentRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdateIncidentCommand } from "../../commands/definitions/incidents/UpdateIncidentCommand";
import { IncidentUpdatedEvent } from "../../../domain/events/incidents/IncidentUpdatedEvent";
import { IncidentNotFoundError } from "../../../domain/errors/incidents/IncidentNotFoundError";

export class UpdateIncidentUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateIncidentCommand): Promise<void> {
    const existingIncident = await this.incidentRepository.getIncidentById(command.id);
    if (!existingIncident) {
      throw new IncidentNotFoundError(command.id);
    }

    const updatedIncident = existingIncident.update(
      command.description,
      command.status,
      command.updatedBy
    );

    if (updatedIncident instanceof Error) {
      throw updatedIncident;
    }

    await this.incidentRepository.updateIncident(updatedIncident);

    const event: IncidentUpdatedEvent = {
      identifier: updatedIncident.id,
      type: "INCIDENT_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedIncident.id,
        description: updatedIncident.description.value,
        status: updatedIncident.status.value,
        updatedAt: updatedIncident.updatedAt,
        updatedBy: updatedIncident.updatedBy
      }
    };

    await this.eventStore.publish(event, `incident-${updatedIncident.id}`);
  }
}
