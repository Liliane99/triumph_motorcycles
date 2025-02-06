import { CreateMaintenanceCommand } from '../../definitions/Maintenance/AddMaintenanceCommand';
import { CreateMaintenanceUseCase } from '../../../usecases/Maintenance/AddMaintenanceUseCase';

export class CreateMaintenanceHandler {
  constructor(private readonly useCase: CreateMaintenanceUseCase) {}

  async execute(command: CreateMaintenanceCommand) {
    return await this.useCase.execute(command);
  }
}
