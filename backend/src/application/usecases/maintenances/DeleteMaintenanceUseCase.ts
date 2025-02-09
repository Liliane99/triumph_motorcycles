import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeleteMaintenanceCommand } from "../../commands/definitions/maintenances/DeleteMaintenanceCommand";
import { MaintenanceDeletedEvent } from "../../../domain/events/maintenances/MaintenanceDeletedEvent";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";

export class DeleteMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeleteMaintenanceCommand): Promise<void> {
    const existingMaintenance = await this.maintenanceRepository.getMaintenanceById(command.id);
    if (!existingMaintenance) {
      throw new MaintenanceNotFoundError(command.id);
    }

    await this.maintenanceRepository.deleteMaintenance(command.id);

    const event: MaintenanceDeletedEvent = {
      identifier: command.id,
      type: "MAINTENANCE_DELETED",
      date: new Date(),
      version: 1,
      data: {
        id: command.id
      }
    };

    await this.eventStore.publish(event, `maintenance-${command.id}`);
  }
}
