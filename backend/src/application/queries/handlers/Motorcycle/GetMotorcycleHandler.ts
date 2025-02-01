import { GetMotorcycleQuery } from "../../definitions/Motorcycle/GetMotorcycleQuery";
import { GetMotorcycleUseCase } from "../../../usecases/Motorcycle/GetMotorcycleUseCase";

export class GetMotorcycleHandler {
  constructor(private readonly useCase: GetMotorcycleUseCase) {}

  async execute(query: GetMotorcycleQuery) {
    return this.useCase.execute(query);
  }
}
