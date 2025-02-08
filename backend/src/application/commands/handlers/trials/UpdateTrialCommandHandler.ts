import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrialCommand } from "../../definitions/trials/UpdateTrialCommand";
import { UpdateTrialUseCase } from "../../../usecases/trials/UpdateTrialUseCase";

@CommandHandler(UpdateTrialCommand)
export class UpdateTrialCommandHandler implements ICommandHandler<UpdateTrialCommand> {
  constructor(private readonly updateTrialUseCase: UpdateTrialUseCase) {}

  async execute(command: UpdateTrialCommand): Promise<void> {
    try {
      await this.updateTrialUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'essai :`, error);
      throw error;
    }
  }
}
