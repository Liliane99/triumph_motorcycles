import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteMaintenanceCommand } from "../../definitions/maintenances/DeleteMaintenanceCommand";
import { DeleteMaintenanceUseCase } from "../../../usecases/maintenances/DeleteMaintenanceUseCase";

@CommandHandler(DeleteMaintenanceCommand)
export class DeleteMaintenanceCommandHandler implements ICommandHandler<DeleteMaintenanceCommand> {
  constructor(private readonly deleteMaintenanceUseCase: DeleteMaintenanceUseCase) {}

  async execute(command: DeleteMaintenanceCommand): Promise<void> {
    try {
      await this.deleteMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la maintenance :`, error);
      throw error;
    }
  }
}
