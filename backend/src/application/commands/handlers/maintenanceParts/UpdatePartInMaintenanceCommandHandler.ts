import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePartInMaintenanceCommand } from "../../definitions/maintenanceParts/UpdatePartInMaintenanceCommand";
import { UpdatePartInMaintenanceUseCase } from "../../../usecases/maintenanceParts/UpdatePartInMaintenanceUseCase";

@CommandHandler(UpdatePartInMaintenanceCommand)
export class UpdatePartInMaintenanceCommandHandler implements ICommandHandler<UpdatePartInMaintenanceCommand> {
  constructor(private readonly updatePartInMaintenanceUseCase: UpdatePartInMaintenanceUseCase) {}

  async execute(command: UpdatePartInMaintenanceCommand): Promise<void> {
    try {
      await this.updatePartInMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la pièce dans la maintenance :`, error);
      throw error;
    }
  }
}
