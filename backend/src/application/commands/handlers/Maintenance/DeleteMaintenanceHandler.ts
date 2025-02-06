import { DeleteMaintenanceCommand } from '../../definitions/Maintenance/DeleteMaintenanceCommand';
import { DeleteMaintenanceUseCase } from '../../../usecases/Maintenance/DeleteMaintenanceUseCase';

export class DeleteMaintenanceHandler {
  constructor(private readonly useCase: DeleteMaintenanceUseCase) {}

  async execute(command: DeleteMaintenanceCommand) {
    return await this.useCase.execute(command);
  }
}
