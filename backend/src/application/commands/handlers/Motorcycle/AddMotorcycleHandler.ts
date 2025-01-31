import { CreateMotorcycleCommand } from "../../definitions/Motorcycle/AddMotorcycleCommand";
import { CreateMotorcycleUseCase } from "../../../usecases/Motorcycle/AddMotorcycleUseCase";

export class CreateMotorcycleHandler {
  constructor(private readonly useCase: CreateMotorcycleUseCase) {}

  async execute(command: CreateMotorcycleCommand) {
    return this.useCase.execute(command);
  }
}
