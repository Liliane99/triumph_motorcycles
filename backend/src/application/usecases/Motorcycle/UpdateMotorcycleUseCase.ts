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
    if (command.date !== undefined) motorcycle.date = command.date;
    if (command.licensePlate !== undefined) motorcycle.licensePlate = command.licensePlate;
    if (command.kilometers !== undefined) motorcycle.kilometers = command.kilometers;
    if (command.warranty) motorcycle.warranty = command.warranty;
    if (command.maintenanceInterval) motorcycle.maintenanceInterval = command.maintenanceInterval;

    return this.motorcycleRepository.save(motorcycle);
  }
}
