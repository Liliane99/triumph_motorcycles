import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePartCommand } from "../definitions/UpdatePartCommand";
import { UpdatePartUseCase } from "../../../application/usecases/parts/UpdatePartUseCase";

@CommandHandler(UpdatePartCommand)
export class UpdatePartCommandHandler implements ICommandHandler<UpdatePartCommand> {
  constructor(private readonly updatePartUseCase: UpdatePartUseCase) {}

  async execute(command: UpdatePartCommand): Promise<void> {
    try {
      await this.updatePartUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la pièce :`, error);
      throw error;
    }
  }
}
