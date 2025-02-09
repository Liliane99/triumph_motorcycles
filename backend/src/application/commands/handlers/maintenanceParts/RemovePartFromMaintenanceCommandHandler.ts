import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemovePartFromMaintenanceCommand } from "../../definitions/maintenanceParts/RemovePartFromMaintenanceCommand";
import { RemovePartFromMaintenanceUseCase } from "../../../usecases/maintenanceParts/RemovePartFromMaintenanceUseCase";

@CommandHandler(RemovePartFromMaintenanceCommand)
export class RemovePartFromMaintenanceCommandHandler implements ICommandHandler<RemovePartFromMaintenanceCommand> {
  constructor(private readonly removePartFromMaintenanceUseCase: RemovePartFromMaintenanceUseCase) {}

  async execute(command: RemovePartFromMaintenanceCommand): Promise<void> {
    try {
      await this.removePartFromMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la pièce de la maintenance :`, error);
      throw error;
    }
  }
}
