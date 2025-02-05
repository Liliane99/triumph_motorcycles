import { RentalRepository } from "../../ports/repositories/RentalRepository";
import { DeleteRentalCommand } from "../../commands/definitions/Rental/DeleteRentalCommand";

export class DeleteRentalUseCase {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(command: DeleteRentalCommand): Promise<void> {
    const rental = await this.rentalRepository.findById(command.id);
    if (!rental) {
      throw new Error("Rental not found");
    }

    return this.rentalRepository.delete(command.id);
  }
}
