import { MaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { UpdateMaintenanceCommand } from "../../commands/definitions/Maintenance/UpdateMaintenanceCommand";
import { Maintenance } from "../../../domain/entities/Maintenance";

export class UpdateMaintenanceUseCase {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(command: UpdateMaintenanceCommand): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findById(command.id);
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    if (command.date) maintenance.date = command.date;
    if (command.technician) maintenance.technician = command.technician;
    if (command.recommendation) maintenance.recommendation = command.recommendation;
    if (command.pricePartTotal !== undefined) maintenance.pricePartTotal = command.pricePartTotal;
    if (command.priceLabour !== undefined) maintenance.priceLabour = command.priceLabour;
    
    maintenance.priceTotal = maintenance.pricePartTotal + maintenance.priceLabour;

    return this.maintenanceRepository.save(maintenance);
  }
}
