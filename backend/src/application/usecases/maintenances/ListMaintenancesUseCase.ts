import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";

export class ListMaintenancesUseCase {
  constructor(private readonly maintenanceRepository: IMaintenanceRepository) {}

  async execute() { 
    return this.maintenanceRepository.listMaintenances();
  }
}
