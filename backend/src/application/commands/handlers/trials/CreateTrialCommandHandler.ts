import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrialCommand } from "../../definitions/trials/CreateTrialCommand";
import { CreateTrialUseCase } from "../../../usecases/trials/CreateTrialUseCase";

@CommandHandler(CreateTrialCommand)
export class CreateTrialCommandHandler implements ICommandHandler<CreateTrialCommand> {
  constructor(private readonly createTrialUseCase: CreateTrialUseCase) {}

  async execute(command: CreateTrialCommand): Promise<void> {
    try {
      await this.createTrialUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de l'essai :`, error);
      throw error;
    }
  }
}
