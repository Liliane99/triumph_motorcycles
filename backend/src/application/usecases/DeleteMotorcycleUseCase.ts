import { MotorcycleRepository } from "../../domain/repositories/MotorcycleRepository";
import { DeleteMotorcycleCommand } from "../commands/definitions/DeleteMotorcycleCommand";

export class DeleteMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: DeleteMotorcycleCommand): Promise<void> {
    const motorcycle = await this.motorcycleRepository.findById(command.id);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    await this.motorcycleRepository.delete(command.id);
  }
}
