import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../definitions/DeleteUserCommand";
import { DeleteUserUseCase } from "../../../application/usecases/users/DeleteUserUseCase";

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    try {
      await this.deleteUserUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur :`, error);
      throw error;
    }
  }
}
