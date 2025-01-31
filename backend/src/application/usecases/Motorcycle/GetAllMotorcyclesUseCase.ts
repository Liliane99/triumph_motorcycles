import { MotorcycleRepository } from "../../../domain/repositories/MotorcycleRepository";
import { GetAllMotorcyclesQuery } from "../../queries/definitions/GetMotorcycleQuery";

export class GetAllMotorcyclesUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetAllMotorcyclesQuery) {
    return this.motorcycleRepository.getAll();
  }
}
