import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "../../definitions/users/UpdateUserCommand";
import { UpdateUserUseCase } from "../../../../application/usecases/users/UpdateUserUseCase";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    try {
      await this.updateUserUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur :`, error);
      throw error;
    }
  }
}
