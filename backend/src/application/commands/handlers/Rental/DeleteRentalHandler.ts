import { DeleteRentalCommand } from "../../definitions/Rental/DeleteRentalCommand";
import { DeleteRentalUseCase } from "../../../usecases/Rental/DeleteRentalUseCase";

export class DeleteRentalHandler {
  constructor(private readonly useCase: DeleteRentalUseCase) {}

  async execute(command: DeleteRentalCommand) {
    return this.useCase.execute(command);
  }
}
