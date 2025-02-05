import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePartCommand } from "../../definitions/parts/CreatePartCommand";
import { CreatePartUseCase } from "../../../../application/usecases/parts/CreatePartUseCase";

@CommandHandler(CreatePartCommand)
export class CreatePartCommandHandler implements ICommandHandler<CreatePartCommand> {
  constructor(private readonly createPartUseCase: CreatePartUseCase) {}

  async execute(command: CreatePartCommand): Promise<void> {
    try {
      await this.createPartUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de la pièce :`, error);
      throw error;
    }
  }
}
