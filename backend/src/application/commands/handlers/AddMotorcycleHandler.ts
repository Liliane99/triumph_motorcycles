import { MotorcycleRepository } from '../../../domain/repositories/MotorcycleRepository';
import { CreateMotorcycleCommand } from '../definitions/AddMotorcycleCommand';
import { Motorcycle } from '../../../domain/entities/Motorcycle';

export class CreateMotorcycleHandler {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: CreateMotorcycleCommand) {
    const motorcycle = new Motorcycle(
      `${Math.random()}`, 
      command.brand,
      command.model,
      command.year,
      command.licensePlate,
      command.kilometers
    );
    console.log("Motorcycle created in handler:", motorcycle);

    return this.motorcycleRepository.save(motorcycle);
  }
}
