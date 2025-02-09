import { IIncidentRepository } from "../../ports/repositories/IncidentRepository";

export class ListIncidentsUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute() {
    return this.incidentRepository.listIncidents();
  }
}
