import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListIncidentsQuery } from "../../definitions/incidents/ListIncidentsQuery";
import { ListIncidentsUseCase } from "../../../../application/usecases/incidents/ListIncidentsUseCase";

@QueryHandler(ListIncidentsQuery)
export class ListIncidentsQueryHandler implements IQueryHandler<ListIncidentsQuery> {
  constructor(private readonly listIncidentsUseCase: ListIncidentsUseCase) {}

  async execute() {
    try {
      return await this.listIncidentsUseCase.execute();
    } catch (error) {
      console.error(`Erreur lors de la récupération des incidents :`, error);
      throw error;
    }
  }
}
