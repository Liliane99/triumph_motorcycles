import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllIncidentsQuery } from "../../definitions/Incident/GetIncidentQuery";
import { IncidentRepository } from "../../../../application/ports/repositories/IncidentRepository";
import { Incident } from "../../../../domain/entities/Incident";

@QueryHandler(GetAllIncidentsQuery)
export class GetAllIncidentsHandler implements IQueryHandler<GetAllIncidentsQuery> {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(query: GetAllIncidentsQuery): Promise<Incident[]> {
    return await this.incidentRepository.getAll();
  }
}
