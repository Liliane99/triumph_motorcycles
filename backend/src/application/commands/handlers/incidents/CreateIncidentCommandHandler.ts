import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateIncidentCommand } from "../../definitions/incidents/CreateIncidentCommand";
import { CreateIncidentUseCase } from "../../../../application/usecases/incidents/CreateIncidentUseCase";

@CommandHandler(CreateIncidentCommand)
export class CreateIncidentCommandHandler implements ICommandHandler<CreateIncidentCommand> {
  constructor(private readonly createIncidentUseCase: CreateIncidentUseCase) {}

  async execute(command: CreateIncidentCommand): Promise<void> {
    try {
      await this.createIncidentUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de l'incident :`, error);
      throw error;
    }
  }
}
