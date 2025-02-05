import { UpdateMotorcycleCommand } from "../../definitions/Motorcycle/UpdateMotorcycleCommand";
import { UpdateMotorcycleUseCase } from "../../../usecases/Motorcycle/UpdateMotorcycleUseCase";

export class UpdateMotorcycleHandler {
  constructor(private readonly useCase: UpdateMotorcycleUseCase) {}

  async execute(command: UpdateMotorcycleCommand) {
    return this.useCase.execute(command);
  }
}
