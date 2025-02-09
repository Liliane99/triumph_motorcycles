import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListMaintenancesQuery } from "../../definitions/maintenances/ListMaintenancesQuery";
import { ListMaintenancesUseCase } from "../../../usecases/maintenances/ListMaintenancesUseCase";

@QueryHandler(ListMaintenancesQuery)
export class ListMaintenancesQueryHandler implements IQueryHandler<ListMaintenancesQuery> {
  constructor(private readonly listMaintenancesUseCase: ListMaintenancesUseCase) {}

  async execute() {
    try {
      return await this.listMaintenancesUseCase.execute();
    } catch (error) {
      console.error(`Erreur lors de la récupération des maintenances :`, error);
      throw error;
    }
  }
}
