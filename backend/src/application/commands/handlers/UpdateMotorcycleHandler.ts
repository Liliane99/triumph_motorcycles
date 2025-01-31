// application/command/handlers/update-motorcycle.handler.ts
import { MotorcycleRepository } from '../../../domain/repositories/MotorcycleRepository';
import { UpdateMotorcycleCommand } from '../definitions/UpdateMotorcycleCommand';
import { Motorcycle } from '../../../domain/entities/Motorcycle';

export class UpdateMotorcycleHandler {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: UpdateMotorcycleCommand) {
    const motorcycle = await this.motorcycleRepository.findById(command.id);
    if (!motorcycle) {
      throw new Error('Motorcycle not found');
    }

  
    if (command.brand) motorcycle.brand = command.brand;
    if (command.model) motorcycle.model = command.model;
    if (command.year) motorcycle.year = command.year;
    if (command.licensePlate) motorcycle.licensePlate = command.licensePlate;
    if (command.kilometers) motorcycle.kilometers = command.kilometers;

    return this.motorcycleRepository.save(motorcycle);
  }
}
