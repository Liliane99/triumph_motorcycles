import { MotorcycleRepository } from "../../../domain/repositories/MotorcycleRepository";
import { Motorcycle } from "../../../domain/entities/Motorcycle";
import { CreateMotorcycleCommand } from "../../commands/definitions/Motorcycle/AddMotorcycleCommand";

export class CreateMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: CreateMotorcycleCommand): Promise<Motorcycle> {
    const motorcycle = new Motorcycle(
      `${Math.random()}`, 
      command.brand,
      command.model,
      command.year,
      command.licensePlate,
      command.kilometers
    );

    return this.motorcycleRepository.save(motorcycle);
  }
}
