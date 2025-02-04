import { UpdateRentalCommand } from "../../definitions/Rental/UpdateRentalCommand";
import { UpdateRentalUseCase } from "../../../usecases/Rental/UpdateRentalUseCase";

export class UpdateRentalHandler {
  constructor(private readonly useCase: UpdateRentalUseCase) {}

  async execute(command: UpdateRentalCommand) {
    return this.useCase.execute(command);
  }
}
