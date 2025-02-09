import { GetAllDriverQuery } from "../../definitions/Driver/GetDriverQuery";
import { GetAllDriversUseCase } from "../../../usecases/Driver/GetAllDriversUseCase";

export class GetAllDriversHandler {
  constructor(private readonly useCase: GetAllDriversUseCase) {}

  async execute(query: GetAllDriverQuery) {
    return this.useCase.execute(query);
  }
}