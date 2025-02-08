import { GetDriverQuery } from "../../definitions/Driver/GetDriverQuery";
import { GetDriverUseCase } from "../../../usecases/Driver/GetDriverUseCase";

export class GetDriverHandler {
  constructor(private readonly useCase: GetDriverUseCase) {}

  async execute(query: GetDriverQuery) {
    return this.useCase.execute(query);
  }
}
