import { IMaintenanceRepository } from "../../ports/repositories/MaintenanceRepository";
import { GetMaintenanceByIdQuery } from "../../queries/definitions/maintenances/GetMaintenanceByIdQuery";
import { MaintenanceNotFoundError } from "../../../domain/errors/maintenances/MaintenanceNotFoundError";

export class GetMaintenanceByIdUseCase {
  constructor(private readonly maintenanceRepository: IMaintenanceRepository) {}

  async execute(query: GetMaintenanceByIdQuery) {
    const maintenance = await this.maintenanceRepository.getMaintenanceById(query.id);
    if (!maintenance) {
      throw new MaintenanceNotFoundError(query.id);
    }
    return maintenance;
  }
}
