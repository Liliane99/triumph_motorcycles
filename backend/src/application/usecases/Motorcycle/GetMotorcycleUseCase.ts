import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { GetMotorcycleQuery } from "../../queries/definitions/Motorcycle/GetMotorcycleQuery";

export class GetMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetMotorcycleQuery) {
    return this.motorcycleRepository.findById(query.id);
  }
}
