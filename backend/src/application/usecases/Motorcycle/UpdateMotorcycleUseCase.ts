import { MotorcycleRepository } from "../../../domain/repositories/MotorcycleRepository";
import { UpdateMotorcycleCommand } from "../../commands/definitions/Motorcycle/UpdateMotorcycleCommand";

export class UpdateMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: UpdateMotorcycleCommand) {
    const motorcycle = await this.motorcycleRepository.findById(command.id);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    if (command.brand !== undefined) motorcycle.brand = command.brand;
    if (command.model !== undefined) motorcycle.model = command.model;
    if (command.year !== undefined) motorcycle.year = command.year;
    if (command.licensePlate !== undefined) motorcycle.licensePlate = command.licensePlate;
    if (command.kilometers !== undefined) motorcycle.kilometers = command.kilometers;

    return this.motorcycleRepository.save(motorcycle);
  }
}
