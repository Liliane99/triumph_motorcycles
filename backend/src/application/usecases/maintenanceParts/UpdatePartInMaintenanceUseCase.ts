import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository"; 
import { IMaintenancePartRepository } from "../../ports/repositories/MaintenancePartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdatePartInMaintenanceCommand } from "../../commands/definitions/maintenanceParts/UpdatePartInMaintenanceCommand";
import { MaintenancePartUpdatedEvent } from "../../../domain/events/maintenanceParts/MaintenancePartUpdatedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";

export class UpdatePartInMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository, 
    private readonly maintenancePartRepository: IMaintenancePartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdatePartInMaintenanceCommand): Promise<void> {
    const part = await this.partRepository.getPartById(command.partId);
    if (!part) {
      throw new PartNotFoundError(command.partId);
    }

    const maintenance = await this.maintenanceRepository.getMaintenanceById(command.maintenanceId);
    if (!maintenance) {
      throw new MaintenanceNotFoundError(command.maintenanceId);
    }

    const existingMaintenancePart = await this.maintenancePartRepository.getMaintenancePart(command.maintenanceId, command.partId);
    if (!existingMaintenancePart) {
      throw new Error(`La pièce ${command.partId} n'existe pas dans la maintenance ${command.maintenanceId}.`);
    }

    await this.maintenancePartRepository.updatePartInMaintenance(command.maintenanceId, command.partId, command.quantityUsed);

    const event: MaintenancePartUpdatedEvent = {
      identifier: `${command.maintenanceId}-${command.partId}`,
      type: "MAINTENANCE_PART_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        maintenanceId: command.maintenanceId,
        partId: command.partId,
        quantityUsed: command.quantityUsed
      }
    };

    await this.eventStore.publish(event, `maintenancePart-${command.maintenanceId}-${command.partId}`);
  }
}
