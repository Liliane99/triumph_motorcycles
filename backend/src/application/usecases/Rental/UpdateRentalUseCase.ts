import { RentalRepository } from "../../ports/repositories/RentalRepository";
import { UpdateRentalCommand } from "../../commands/definitions/Rental/UpdateRentalCommand";
import { Rental } from "../../../domain/entities/Rental";

export class UpdateRentalUseCase {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(command: UpdateRentalCommand): Promise<Rental> {
    const rental = await this.rentalRepository.findById(command.id);
    if (!rental) {
      throw new Error("Rental not found");
    }

    if (command.reference) rental.updateReference(command.reference);
    if (command.price) rental.updatePrice(command.price);
    if (command.rentalDate) rental.updateRentalDate(command.rentalDate);

    return this.rentalRepository.save(rental);
  }
}
