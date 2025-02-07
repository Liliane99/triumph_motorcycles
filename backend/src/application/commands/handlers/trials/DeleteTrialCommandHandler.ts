import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrialCommand } from "../../definitions/trials/DeleteTrialCommand";
import { DeleteTrialUseCase } from "../../../usecases/trials/DeleteTrialUseCase";

@CommandHandler(DeleteTrialCommand)
export class DeleteTrialCommandHandler implements ICommandHandler<DeleteTrialCommand> {
  constructor(private readonly deleteTrialUseCase: DeleteTrialUseCase) {}

  async execute(command: DeleteTrialCommand): Promise<void> {
    try {
      await this.deleteTrialUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'essai :`, error);
      throw error;
    }
  }
}
