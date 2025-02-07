import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateMotorcycleCommand } from "../../commands/definitions/Motorcycle/AddMotorcycleCommand";
import { Motorcycle } from "../../../domain/entities/Motorcycle";
import { BrevoEmailService } from "../../../infrastructure/core/nest/adapters/services/BrevoEmailService";

export class CreateMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository,
  private readonly emailService: BrevoEmailService) {}

  async execute(command: CreateMotorcycleCommand): Promise<Motorcycle> {
    const { brand, model, purchaseDate, licensePlate, kilometers, warrantyDate, maintenanceInterval, ownerId, createdBy } = command;

    
    const motorcycle = new Motorcycle(
      `${Math.random()}`,  
      brand,
      model,
      purchaseDate,
      licensePlate,
      kilometers,
      warrantyDate,
      maintenanceInterval,
      ownerId,
      createdBy
    );

    return this.motorcycleRepository.save(motorcycle);
  }
}