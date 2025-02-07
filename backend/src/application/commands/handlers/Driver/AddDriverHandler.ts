import { CreateDriverCommand } from "../../definitions/Driver/AddDriverCommand";
import { AddDriverUseCase } from "../../../usecases/Driver/AddDriverUseCase";

export class AddDriverHandler {
  constructor(private readonly useCase: AddDriverUseCase) {}

  async execute(command: CreateDriverCommand) {
    return this.useCase.execute(command);
  }
}
