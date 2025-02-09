import { IMaintenancePartRepository } from "../../ports/repositories/MaintenancePartRepository";
import { GetMaintenancePartsQuery } from "../../queries/definitions/maintenanceParts/GetMaintenancePartsQuery";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";

export class GetMaintenancePartsUseCase {
  constructor(private readonly maintenancePartRepository: IMaintenancePartRepository) {}

  async execute(query: GetMaintenancePartsQuery) {
    const maintenanceParts = await this.maintenancePartRepository.getPartsByMaintenanceId(query.maintenanceId);
    
    if (!maintenanceParts || maintenanceParts.length === 0) {
      throw new MaintenanceNotFoundError(query.maintenanceId);
    }

    return maintenanceParts;
  }
}
