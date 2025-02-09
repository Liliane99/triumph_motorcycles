import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddPartToMaintenanceCommand } from "../../definitions/maintenanceParts/AddPartToMaintenanceCommand";
import { AddPartToMaintenanceUseCase } from "../../../usecases/maintenanceParts/AddPartToMaintenanceUseCase";

@CommandHandler(AddPartToMaintenanceCommand)
export class AddPartToMaintenanceCommandHandler implements ICommandHandler<AddPartToMaintenanceCommand> {
  constructor(private readonly addPartToMaintenanceUseCase: AddPartToMaintenanceUseCase) {}

  async execute(command: AddPartToMaintenanceCommand): Promise<void> {
    try {
      await this.addPartToMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la pièce à la maintenance :`, error);
      throw error;
    }
  }
}
