import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetIncidentByIdQuery } from "../../definitions/incidents/GetIncidentByIdQuery";
import { GetIncidentByIdUseCase } from "../../../../application/usecases/incidents/GetIncidentByIdUseCase";

@QueryHandler(GetIncidentByIdQuery)
export class GetIncidentByIdQueryHandler implements IQueryHandler<GetIncidentByIdQuery> {
  constructor(private readonly getIncidentByIdUseCase: GetIncidentByIdUseCase) {}

  async execute(query: GetIncidentByIdQuery) {
    try {
      return await this.getIncidentByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'incident :`, error);
      throw error;
    }
  }
}
