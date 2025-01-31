import { MotorcycleRepository } from "../../../domain/repositories/MotorcycleRepository";
import { GetMotorcycleQuery } from "../../queries/definitions/GetMotorcycleQuery";

export class GetMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetMotorcycleQuery) {
    return this.motorcycleRepository.findById(query.id);
  }
}
