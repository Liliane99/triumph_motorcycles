import { IncidentRepository } from "../../ports/repositories/IncidentRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateIncidentCommand } from "../../commands/definitions/Incident/AddIncidentCommand";
import { Incident } from "../../../domain/entities/Incident";

export class CreateIncidentUseCase {
  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(command: CreateIncidentCommand): Promise<Incident> {
    const { reference, description, date, motorcycleId } = command;

    
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    
    const incident = new Incident(
      `${Math.random()}`,
      reference,
      description,
      date,
      motorcycle
    );

    return this.incidentRepository.save(incident);
  }
}
