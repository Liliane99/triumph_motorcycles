import { CreateMotorcycleCommand } from "../definitions/AddMotorcycleCommand";
import { CreateMotorcycleUseCase } from "../../usecases/AddMotorcycleUseCase";

export class CreateMotorcycleHandler {
  constructor(private readonly useCase: CreateMotorcycleUseCase) {}

  async execute(command: CreateMotorcycleCommand) {
    return this.useCase.execute(command);
  }
}
