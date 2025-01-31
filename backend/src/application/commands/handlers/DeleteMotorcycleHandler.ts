import { MotorcycleRepository } from '../../../domain/repositories/MotorcycleRepository';
import { DeleteMotorcycleCommand } from '../definitions/DeleteMotorcycleCommand';

export class DeleteMotorcycleHandler {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(command: DeleteMotorcycleCommand) {
    await this.motorcycleRepository.delete(command.id);
  }
}
