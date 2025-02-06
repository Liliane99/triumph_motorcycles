import { MaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { GetAllMaintenanceQuery } from "../../queries/definitions/Maintenance/GetMaintenanceQuery";
import { Maintenance } from "../../../domain/entities/Maintenance";

export class GetAllMaintenanceUseCase {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(query: GetAllMaintenanceQuery): Promise<Maintenance[]> {
    return this.maintenanceRepository.getAll();
  }
}
