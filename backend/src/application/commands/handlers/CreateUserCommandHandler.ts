import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../definitions/CreateUserCommand";
import { CreateUserUseCase } from "../../../application/usecases/users/CreateUserUseCase";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(command: CreateUserCommand): Promise<void> {
    try {
      await this.createUserUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de l'utilisateur :`, error);
      throw error;
    }
  }
}
