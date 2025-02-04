import { GetAllRentalQuery } from "../../definitions/Rental/GetRentalQuery";
import { GetAllRentalsUseCase } from "../../../usecases/Rental/GetAllRentalsUseCase";

export class GetAllRentalsHandler {
  constructor(private readonly useCase: GetAllRentalsUseCase) {}

  async execute(query: GetAllRentalQuery) {
    return this.useCase.execute(query);
  }
}
