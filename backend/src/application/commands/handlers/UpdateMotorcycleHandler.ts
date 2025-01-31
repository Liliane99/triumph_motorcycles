import { UpdateMotorcycleCommand } from "../definitions/UpdateMotorcycleCommand";
import { UpdateMotorcycleUseCase } from "../../usecases/UpdateMotorcycleUseCase";

export class UpdateMotorcycleHandler {
  constructor(private readonly useCase: UpdateMotorcycleUseCase) {}

  async execute(command: UpdateMotorcycleCommand) {
    return this.useCase.execute(command);
  }
}
