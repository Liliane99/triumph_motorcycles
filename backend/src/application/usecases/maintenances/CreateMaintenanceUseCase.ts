import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { CreateMaintenanceCommand } from "../../commands/definitions/maintenances/CreateMaintenanceCommand";
import { MaintenanceCreatedEvent } from "../../../domain/events/maintenances/MaintenanceCreatedEvent";
import { Maintenance } from "../../../domain/entities/Maintenance";
import { MaintenanceAlreadyExistsError } from "../../../domain/errors/maintenances/MaintenanceAlreadyExistsError";
import { InvalidMaintenanceDateError } from "../../../domain/errors/maintenances/InvalidMaintenanceDateError";

export class CreateMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: IMaintenanceRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: CreateMaintenanceCommand): Promise<void> {
    const existingMaintenance = await this.maintenanceRepository.getMaintenanceByReference(command.reference);
    if (existingMaintenance) {
      throw new MaintenanceAlreadyExistsError(command.reference);
    }

    const maintenanceDate = new Date(command.date);
    if (isNaN(maintenanceDate.getTime())) {
      throw new InvalidMaintenanceDateError(command.date);
    }

    const maintenance = Maintenance.create(
      command.id,
      command.reference,
      maintenanceDate,  
      command.recommendation,
      command.motorcycleId,
      command.createdBy
    );

    if (maintenance instanceof Error) {
      throw maintenance;
    }

    await this.maintenanceRepository.createMaintenance(maintenance);

    const event: MaintenanceCreatedEvent = {
      identifier: maintenance.id,
      type: "MAINTENANCE_CREATED",
      date: new Date(),
      version: 1,
      data: {
        id: maintenance.id,
        reference: maintenance.reference.value, 
        date: maintenance.date.value, 
        recommendation: maintenance.recommendation.value,
        motorcycleId: maintenance.motorcycleId,
        createdBy: maintenance.createdBy,
        createdAt: maintenance.createdAt,
      }
    };

    await this.eventStore.publish(event, `maintenance-${maintenance.id}`);
  }
}
