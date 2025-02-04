import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { GetAllMotorcyclesQuery } from "../../queries/definitions/Motorcycle/GetMotorcycleQuery";

export class GetAllMotorcyclesUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetAllMotorcyclesQuery) {
    return this.motorcycleRepository.getAll();
  }
}
