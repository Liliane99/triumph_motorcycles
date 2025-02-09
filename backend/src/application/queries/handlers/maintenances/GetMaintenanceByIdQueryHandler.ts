import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetMaintenanceByIdQuery } from "../../definitions/maintenances/GetMaintenanceByIdQuery";
import { GetMaintenanceByIdUseCase } from "../../../usecases/maintenances/GetMaintenanceByIdUseCase";

@QueryHandler(GetMaintenanceByIdQuery)
export class GetMaintenanceByIdQueryHandler implements IQueryHandler<GetMaintenanceByIdQuery> {
  constructor(private readonly getMaintenanceByIdUseCase: GetMaintenanceByIdUseCase) {}

  async execute(query: GetMaintenanceByIdQuery) {
    try {
      return await this.getMaintenanceByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la maintenance :`, error);
      throw error;
    }
  }
}
