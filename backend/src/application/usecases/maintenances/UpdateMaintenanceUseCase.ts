import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { UpdateMaintenanceCommand } from "../../commands/definitions/maintenances/UpdateMaintenanceCommand";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { MaintenanceUpdatedEvent } from "../../../domain/events/maintenances/MaintenanceUpdatedEvent";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";
import { InvalidMaintenanceDateError } from "../../../domain/errors/maintenances/InvalidMaintenanceDateError";
import { MaintenanceDate } from "../../../domain/values/maintenances/MaintenanceDate";

export class UpdateMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateMaintenanceCommand): Promise<void> {
    const existingMaintenance = await this.maintenanceRepository.getMaintenanceById(command.id);
    if (!existingMaintenance) {
      throw new MaintenanceNotFoundError(command.id);
    }

    // ✅ Validation et parsing de la date
    let validDate = existingMaintenance.date;
    if (command.date) {
      const parsedDate = new Date(command.date);
      if (isNaN(parsedDate.getTime())) {
        throw new InvalidMaintenanceDateError(command.date);
      }

      const maintenanceDate = MaintenanceDate.from(parsedDate);
      if (maintenanceDate instanceof Error) {
        throw maintenanceDate;
      }

      validDate = maintenanceDate;
    }

    // ✅ Mise à jour de la maintenance
    const updatedMaintenance = existingMaintenance.update(
      validDate.value,  
      command.recommendation ?? existingMaintenance.recommendation.value, 
      command.updatedBy
    );
    
    if (updatedMaintenance instanceof Error) {
      throw updatedMaintenance;
    }

    await this.maintenanceRepository.updateMaintenance(updatedMaintenance);

    // ✅ Ajout de `date` dans l'événement
    const event: MaintenanceUpdatedEvent = {
      identifier: updatedMaintenance.id,
      type: "MAINTENANCE_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedMaintenance.id,
        date: updatedMaintenance.date.value, // ✅ Correction ici
        recommendation: updatedMaintenance.recommendation.value,
        updatedBy: updatedMaintenance.updatedBy,
        updatedAt: updatedMaintenance.updatedAt,
      }
    };

    await this.eventStore.publish(event, `maintenance-${updatedMaintenance.id}`);
  }
}
