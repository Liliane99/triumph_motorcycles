import { IncidentRepository } from "../../ports/repositories/IncidentRepository";
import { UpdateIncidentCommand } from "../../commands/definitions/Incident/UpdateIncidentCommand";
import { Incident } from "../../../domain/entities/Incident";

export class UpdateIncidentUseCase {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(command: UpdateIncidentCommand): Promise<Incident> {
    const incident = await this.incidentRepository.findById(command.id);
    if (!incident) {
      throw new Error("Incident not found");
    }

    if (command.date) incident.date = command.date;
    if (command.description) incident.description = command.description;
    if (command.motorcycleId) incident.motorcycleId = command.motorcycleId;
    
   
    return this.incidentRepository.save(incident);
  }
}
