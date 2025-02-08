import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { DeleteDriverCommand } from "../../commands/definitions/Driver/DeleteDriverCommand";

export class DeleteDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(command: DeleteDriverCommand): Promise<void> {
    const driver = await this.driverRepository.findById(command.id);
    if (!driver) {
      throw new Error("Driver not found");
    }

    return this.driverRepository.delete(command.id);
  }
}
