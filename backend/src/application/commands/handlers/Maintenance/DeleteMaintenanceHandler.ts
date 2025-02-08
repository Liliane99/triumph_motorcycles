import { CommandHandler, QueryHandler } from "@nestjs/cqrs";
import { DeleteMaintenanceCommand } from '../../definitions/Maintenance/DeleteMaintenanceCommand';
import { DeleteMaintenanceUseCase } from '../../../usecases/Maintenance/DeleteMaintenanceUseCase';

@CommandHandler(DeleteMaintenanceCommand)
export class DeleteMaintenanceHandler {
  constructor(private readonly useCase: DeleteMaintenanceUseCase) {}

  async execute(command: DeleteMaintenanceCommand) {
    return this.useCase.execute(command.id);
  }
}