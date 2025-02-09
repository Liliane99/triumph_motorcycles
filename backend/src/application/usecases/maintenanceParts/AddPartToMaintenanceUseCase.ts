import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { IMaintenancePartRepository } from "../../ports/repositories/MaintenancePartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { AddPartToMaintenanceCommand } from "../../commands/definitions/maintenanceParts/AddPartToMaintenanceCommand";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";
import { MaintenancePartAddedEvent } from "../../../domain/events/maintenanceParts/MaintenancePartAddedEvent";
import { MaintenancePart } from "../../../domain/entities/MaintenancePart";

export class AddPartToMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,  
    private readonly maintenancePartRepository: IMaintenancePartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: AddPartToMaintenanceCommand): Promise<void> {
    const part = await this.partRepository.getPartById(command.partId);
    if (!part) {
      throw new PartNotFoundError(command.partId);
    }

    const maintenance = await this.maintenanceRepository.getMaintenanceById(command.maintenanceId);  
    if (!maintenance) {
      throw new MaintenanceNotFoundError(command.maintenanceId);
    }

    const maintenancePart = MaintenancePart.create(
      command.maintenanceId,
      command.partId,
      command.quantityUsed
    );
    
    if (maintenancePart instanceof Error) {
      throw maintenancePart; 
    }
    
    await this.maintenancePartRepository.addPartToMaintenance(maintenancePart);

    const updatedPart = part.update(
      part.name.value,
      part.quantityInStock.value - command.quantityUsed, 
      part.partThreshold.value,
      part.unitPrice.value,
      maintenance.createdBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: MaintenancePartAddedEvent = {
      identifier: `${command.maintenanceId}-${command.partId}`,
      type: "MAINTENANCE_PART_ADDED",
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
