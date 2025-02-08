import { IncidentRepository } from "../../ports/repositories/IncidentRepository";
import { GetAllIncidentsQuery } from "../../queries/definitions/Incident/GetIncidentQuery";
import { Incident } from "../../../domain/entities/Incident";

export class GetAllIncidentUseCase {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(query: GetAllIncidentsQuery): Promise<Incident[]> {
    return this.incidentRepository.getAll();
  }
}
