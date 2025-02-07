import { UpdateDriverCommand } from "../../definitions/Driver/UpdateDriverCommand";
import { UpdateDriverUseCase } from "../../../usecases/Driver/UpdateDriverUseCase";

export class UpdateDriverHandler {
  constructor(private readonly useCase: UpdateDriverUseCase) {}

  async execute(command: UpdateDriverCommand) {
    return this.useCase.execute(command);
  }
}
