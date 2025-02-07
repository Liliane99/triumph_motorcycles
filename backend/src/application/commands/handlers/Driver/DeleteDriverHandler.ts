import { DeleteDriverCommand } from "../../definitions/Driver/DeleteDriverCommand";
import { DeleteDriverUseCase } from "../../../usecases/Driver/DeleteDriverUseCase";

export class DeleteDriverHandler {
  constructor(private readonly useCase: DeleteDriverUseCase) {}

  async execute(command: DeleteDriverCommand) {
    return this.useCase.execute(command);
  }
}
