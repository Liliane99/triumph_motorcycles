import { IIncidentRepository } from "../../ports/repositories/IncidentRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeleteIncidentCommand } from "../../commands/definitions/incidents/DeleteIncidentCommand";
import { IncidentDeletedEvent } from "../../../domain/events/incidents/IncidentDeletedEvent";
import { IncidentNotFoundError } from "../../../domain/errors/incidents/IncidentNotFoundError";

export class DeleteIncidentUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeleteIncidentCommand): Promise<void> {
    const existingIncident = await this.incidentRepository.getIncidentById(command.id);
    if (!existingIncident) {
      throw new IncidentNotFoundError(command.id);
    }

    await this.incidentRepository.deleteIncident(command.id);

    const event: IncidentDeletedEvent = {
      identifier: command.id,
      type: "INCIDENT_DELETED",
      date: new Date(),
      version: 1,
      data: {
        id: command.id
      }
    };

    await this.eventStore.publish(event, `incident-${command.id}`);
  }
}
