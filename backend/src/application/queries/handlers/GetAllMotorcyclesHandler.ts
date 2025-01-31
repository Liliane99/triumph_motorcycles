import { GetAllMotorcyclesQuery } from "../definitions/GetMotorcycleQuery";
import { GetAllMotorcyclesUseCase } from "../../usecases/GetAllMotorcyclesUseCase";

export class GetAllMotorcyclesHandler {
  constructor(private readonly useCase: GetAllMotorcyclesUseCase) {}

  async execute(query: GetAllMotorcyclesQuery) {
    return this.useCase.execute(query);
  }
}
