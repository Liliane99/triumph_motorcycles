import { DeleteMotorcycleCommand } from "../../definitions/Motorcycle/DeleteMotorcycleCommand";
import { DeleteMotorcycleUseCase } from "../../../usecases/Motorcycle/DeleteMotorcycleUseCase";

export class DeleteMotorcycleHandler {
  constructor(private readonly useCase: DeleteMotorcycleUseCase) {}

  async execute(command: DeleteMotorcycleCommand) {
    await this.useCase.execute(command);
  }
}
