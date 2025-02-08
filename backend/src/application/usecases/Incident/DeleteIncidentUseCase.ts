import { IncidentRepository } from "../../ports/repositories/IncidentRepository";

export class DeleteIncidentUseCase {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(id: string): Promise<void> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      throw new Error("Incident not found");
    }

    await this.incidentRepository.delete(id);
  }
}
