import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository"; 
import { IMaintenancePartRepository } from "../../ports/repositories/MaintenancePartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { RemovePartFromMaintenanceCommand } from "../../commands/definitions/maintenanceParts/RemovePartFromMaintenanceCommand";
import { MaintenancePartRemovedEvent } from "../../../domain/events/maintenanceParts/MaintenancePartRemovedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";

export class RemovePartFromMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository, 
    private readonly maintenancePartRepository: IMaintenancePartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: RemovePartFromMaintenanceCommand): Promise<void> {
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

    const quantityUsed = existingMaintenancePart.quantityUsed.value; 

    await this.maintenancePartRepository.removePartFromMaintenance(command.maintenanceId, command.partId);

    const updatedPart = part.update(
      part.name.value,
      part.quantityInStock.value + quantityUsed, 
      part.partThreshold.value,
      part.unitPrice.value,
      maintenance.createdBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: MaintenancePartRemovedEvent = {
      identifier: `${command.maintenanceId}-${command.partId}`,
      type: "MAINTENANCE_PART_REMOVED",
      date: new Date(),
      version: 1,
      data: {
        maintenanceId: command.maintenanceId,
        partId: command.partId,
        quantityRemoved: quantityUsed 
      }
    };

    await this.eventStore.publish(event, `maintenancePart-${command.maintenanceId}-${command.partId}`);
  }
}
