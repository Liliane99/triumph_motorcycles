import { MaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { CreateMaintenanceCommand } from "../../commands/definitions/Maintenance/AddMaintenanceCommand";
import { Maintenance } from "../../../domain/entities/Maintenance";

export class CreateMaintenanceUseCase {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly partRepository: IPartRepository
  ) {}

  async execute(command: CreateMaintenanceCommand): Promise<Maintenance> {
    const { reference, date, technician, recommendation, pricePartTotal, priceLabour, motorcycleId, partId } = command;

    
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

   
    const part = await this.partRepository.getPartById(partId);
    if (!part) {
      throw new Error("Part not found");
    }

   
    const maintenance = new Maintenance(
      `${Math.random()}`,
      reference,
      date,
      technician,
      recommendation,
      pricePartTotal,
      priceLabour,
      motorcycle,
      part
    );

    return this.maintenanceRepository.save(maintenance);
  }
}
