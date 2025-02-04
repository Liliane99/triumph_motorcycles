import { RentalRepository } from "../../ports/repositories/Rentalrepository";
import { GetRentalQuery } from "../../queries/definitions/Rental/GetRentalQuery";
import { Rental } from "../../../domain/entities/Rental";

export class GetRentalUseCase {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(query: GetRentalQuery): Promise<Rental | null> {
    return this.rentalRepository.findById(query.id);
  }
}
