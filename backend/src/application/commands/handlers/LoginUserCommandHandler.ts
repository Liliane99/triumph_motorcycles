import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginUserCommand } from "../definitions/LoginUserCommand";
import { LoginUserUseCase } from "../../../application/usecases/users/LoginUserUseCase";
import { InvalidCredentialsError } from "../../../domain/errors/users/InvalidCredentialsError";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  async execute(command: LoginUserCommand): Promise<string> {
    try {
      return await this.loginUserUseCase.execute(command);
    } catch (error) {
      if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        console.warn(`Erreur d'authentification : ${error.message}`);
      } else {
        console.error(`Erreur lors de la connexion :`, error);
      }
      throw error;
    }
  }
}
