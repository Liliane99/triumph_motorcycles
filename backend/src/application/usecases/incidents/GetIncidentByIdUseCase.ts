import { IIncidentRepository } from "../../ports/repositories/IncidentRepository";
import { GetIncidentByIdQuery } from "../../queries/definitions/incidents/GetIncidentByIdQuery";
import { IncidentNotFoundError } from "../../../domain/errors/incidents/IncidentNotFoundError";

export class GetIncidentByIdUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(query: GetIncidentByIdQuery) {
    const incident = await this.incidentRepository.getIncidentById(query.id);
    if (!incident) {
      throw new IncidentNotFoundError(query.id);
    }
    return incident;
  }
}
