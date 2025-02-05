import { GetAllMotorcyclesQuery } from "../../definitions/Motorcycle/GetMotorcycleQuery";
import { GetAllMotorcyclesUseCase } from "../../../usecases/Motorcycle/GetAllMotorcyclesUseCase";

export class GetAllMotorcyclesHandler {
  constructor(private readonly useCase: GetAllMotorcyclesUseCase) {}

  async execute(query: GetAllMotorcyclesQuery) {
    return this.useCase.execute(query);
  }
}
