import { DeleteMotorcycleCommand } from "../definitions/DeleteMotorcycleCommand";
import { DeleteMotorcycleUseCase } from "../../usecases/DeleteMotorcycleUseCase";

export class DeleteMotorcycleHandler {
  constructor(private readonly useCase: DeleteMotorcycleUseCase) {}

  async execute(command: DeleteMotorcycleCommand) {
    await this.useCase.execute(command);
  }
}
