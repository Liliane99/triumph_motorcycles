import { RentalRepository } from "../../ports/repositories/Rentalrepository";
import { GetAllRentalQuery } from "../../queries/definitions/Rental/GetRentalQuery";
import { Rental } from "../../../domain/entities/Rental";

export class GetAllRentalsUseCase {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(query: GetAllRentalQuery): Promise<Rental[]> {
    return this.rentalRepository.getAll();
  }
}
