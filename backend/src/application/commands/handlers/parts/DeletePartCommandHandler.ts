import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePartCommand } from "../../definitions/parts/DeletePartCommand";
import { DeletePartUseCase } from "../../../../application/usecases/parts/DeletePartUseCase";

@CommandHandler(DeletePartCommand)
export class DeletePartCommandHandler implements ICommandHandler<DeletePartCommand> {
  constructor(private readonly deletePartUseCase: DeletePartUseCase) {}

  async execute(command: DeletePartCommand): Promise<void> {
    try {
      await this.deletePartUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la pièce :`, error);
      throw error;
    }
  }
}
