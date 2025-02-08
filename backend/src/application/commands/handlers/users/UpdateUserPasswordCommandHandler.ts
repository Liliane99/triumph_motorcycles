import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserPasswordCommand } from "../../definitions/users/UpdateUserPasswordCommand";
import { UpdateUserPasswordUseCase } from "../../../../application/usecases/users/UpdateUserPasswordUseCase";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordCommandHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase) {}

  async execute(command: UpdateUserPasswordCommand): Promise<void> {
    try {
      await this.updateUserPasswordUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du mot de passe :`, error);
      throw error;
    }
  }
}
