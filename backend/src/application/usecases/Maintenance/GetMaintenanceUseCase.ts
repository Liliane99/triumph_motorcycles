import { MaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { GetMaintenanceQuery } from "../../queries/definitions/Maintenance/GetMaintenanceQuery";
import { Maintenance } from "../../../domain/entities/Maintenance";

export class GetMaintenanceUseCase {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(query: GetMaintenanceQuery): Promise<Maintenance | null> {
    return this.maintenanceRepository.findById(query.id);
  }
}
