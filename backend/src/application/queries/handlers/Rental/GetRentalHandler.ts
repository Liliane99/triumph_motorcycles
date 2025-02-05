import { GetRentalQuery } from "../../definitions/Rental/GetRentalQuery";
import { GetRentalUseCase } from "../../../usecases/Rental/GetRentalUseCase";

export class GetRentalHandler {
  constructor(private readonly useCase: GetRentalUseCase) {}

  async execute(query: GetRentalQuery) {
    return this.useCase.execute(query);
  }
}
