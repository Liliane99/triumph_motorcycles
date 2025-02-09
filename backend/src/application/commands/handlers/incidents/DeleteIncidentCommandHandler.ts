import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteIncidentCommand } from "../../definitions/incidents/DeleteIncidentCommand";
import { DeleteIncidentUseCase } from "../../../../application/usecases/incidents/DeleteIncidentUseCase";

@CommandHandler(DeleteIncidentCommand)
export class DeleteIncidentCommandHandler implements ICommandHandler<DeleteIncidentCommand> {
  constructor(private readonly deleteIncidentUseCase: DeleteIncidentUseCase) {}

  async execute(command: DeleteIncidentCommand): Promise<void> {
    try {
      await this.deleteIncidentUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'incident :`, error);
      throw error;
    }
  }
}
