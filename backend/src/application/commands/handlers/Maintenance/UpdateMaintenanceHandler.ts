import { CommandHandler, QueryHandler } from "@nestjs/cqrs";
import { UpdateMaintenanceCommand } from '../../definitions/Maintenance/UpdateMaintenanceCommand';
import { UpdateMaintenanceUseCase } from '../../../usecases/Maintenance/UpdateMaintenanceUseCase';

@CommandHandler(UpdateMaintenanceCommand)
export class UpdateMaintenanceHandler {
  constructor(private readonly useCase: UpdateMaintenanceUseCase) {}

  async execute(command: UpdateMaintenanceCommand) {
    return await this.useCase.execute(command);
  }
}