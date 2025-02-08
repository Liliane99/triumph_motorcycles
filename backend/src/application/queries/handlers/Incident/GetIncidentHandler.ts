import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetIncidentQuery } from "../../definitions/Incident/GetIncidentQuery";
import { IncidentRepository } from "../../../../application/ports/repositories/IncidentRepository";


@QueryHandler(GetIncidentQuery)
export class GetIncidentHandler{
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(query: GetIncidentQuery) {
    return await this.incidentRepository.findById(query.id);
  }
}


