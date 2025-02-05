import { CreateRentalCommand } from "../../definitions/Rental/AddRentalCommand";
import { AddRentalUseCase } from "../../../usecases/Rental/AddRentalUseCase";

export class AddRentalHandler {
  constructor(private readonly useCase: AddRentalUseCase) {}

  async execute(command: CreateRentalCommand) {
    return this.useCase.execute(command);
  }
}
