import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateIncidentCommand } from "../../definitions/incidents/UpdateIncidentCommand";
import { UpdateIncidentUseCase } from "../../../../application/usecases/incidents/UpdateIncidentUseCase";

@CommandHandler(UpdateIncidentCommand)
export class UpdateIncidentCommandHandler implements ICommandHandler<UpdateIncidentCommand> {
  constructor(private readonly updateIncidentUseCase: UpdateIncidentUseCase) {}

  async execute(command: UpdateIncidentCommand): Promise<void> {
    try {
      await this.updateIncidentUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'incident :`, error);
      throw error;
    }
  }
}
