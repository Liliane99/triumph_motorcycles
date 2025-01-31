import { MotorcycleRepository } from '../../../domain/repositories/MotorcycleRepository';
import { GetMotorcycleQuery } from '../definitions/GetMotorcycleQuery';
import { GetAllMotorcyclesQuery } from '../definitions/GetMotorcycleQuery';

export class GetMotorcycleHandler {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetMotorcycleQuery) {
    return this.motorcycleRepository.findById(query.id);
  }
}

export class GetAllMotorcyclesHandler {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(query: GetAllMotorcyclesQuery) {
    return this.motorcycleRepository.getAll(); 
  }
}
