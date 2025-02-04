import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateMotorcycleCommand } from "../../commands/definitions/Motorcycle/AddMotorcycleCommand";
import { Motorcycle } from "../../../domain/entities/Motorcycle";

export class CreateMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: CreateMotorcycleCommand): Promise<Motorcycle> {
    const { brand, model, purchaseDate, licensePlate, kilometers, warrantyDate, maintenanceInterval } = command;

    
    const motorcycle = new Motorcycle(
      `${Math.random()}`,  
      brand,
      model,
      purchaseDate,
      licensePlate,
      kilometers,
      warrantyDate,
      maintenanceInterval
    );

    return this.motorcycleRepository.save(motorcycle);
  }
}
