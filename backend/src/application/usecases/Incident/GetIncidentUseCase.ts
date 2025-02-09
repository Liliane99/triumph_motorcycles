import { IncidentRepository } from "../../ports/repositories/IncidentRepository";
import { GetIncidentQuery } from "../../queries/definitions/Incident/GetIncidentQuery";
import { Incident } from "../../../domain/entities/Incident";

export class GetIncidentUseCase {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(query: GetIncidentQuery): Promise<Incident | null> {
    return this.incidentRepository.findById(query.id);
  }
}
