import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetMaintenancePartsQuery } from "../../definitions/maintenanceParts/GetMaintenancePartsQuery";
import { GetMaintenancePartsUseCase } from "../../../usecases/maintenanceParts/GetMaintenancePartsUseCase";

@QueryHandler(GetMaintenancePartsQuery)
export class GetMaintenancePartsQueryHandler implements IQueryHandler<GetMaintenancePartsQuery> {
  constructor(private readonly getMaintenancePartsUseCase: GetMaintenancePartsUseCase) {}

  async execute(query: GetMaintenancePartsQuery) {
    try {
      return await this.getMaintenancePartsUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération des pièces d'une maintenance :`, error);
      throw error;
    }
  }
}
