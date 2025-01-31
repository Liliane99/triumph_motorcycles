import { GetMotorcycleQuery } from "../definitions/GetMotorcycleQuery";
import { GetMotorcycleUseCase } from "../../usecases/GetMotorcycleUseCase";

export class GetMotorcycleHandler {
  constructor(private readonly useCase: GetMotorcycleUseCase) {}

  async execute(query: GetMotorcycleQuery) {
    return this.useCase.execute(query);
  }
}
