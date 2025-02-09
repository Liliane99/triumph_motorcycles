import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMaintenanceCommand } from "../../definitions/maintenances/CreateMaintenanceCommand";
import { CreateMaintenanceUseCase } from "../../../usecases/maintenances/CreateMaintenanceUseCase";

@CommandHandler(CreateMaintenanceCommand)
export class CreateMaintenanceCommandHandler implements ICommandHandler<CreateMaintenanceCommand> {
  constructor(private readonly createMaintenanceUseCase: CreateMaintenanceUseCase) {}

  async execute(command: CreateMaintenanceCommand): Promise<void> {
    try {
      await this.createMaintenanceUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de la maintenance :`, error);
      throw error;
    }
  }
}
