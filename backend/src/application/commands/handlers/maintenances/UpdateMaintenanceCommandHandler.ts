import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMaintenanceCommand } from "../../definitions/maintenances/UpdateMaintenanceCommand";
import { UpdateMaintenanceUseCase } from "../../../usecases/maintenances/UpdateMaintenanceUseCase";

@CommandHandler(UpdateMaintenanceCommand)
export class UpdateMaintenanceCommandHandler implements ICommandHandler<UpdateMaintenanceCommand> {
  constructor(private readonly updateMaintenanceUseCase: UpdateMaintenanceUseCase) {}

  async execute(command: UpdateMaintenanceCommand): Promise<void> {
    try {
      await this.updateMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la maintenance :`, error);
      throw error;
    }
  }
}
