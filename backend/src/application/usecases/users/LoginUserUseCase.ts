import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IPasswordService, ITokenService } from "../../ports/services/AuthenticationService";
import { LoginUserCommand } from "../../commands/definitions/users/LoginUserCommand";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";
import { InvalidCredentialsError } from "../../../domain/errors/users/InvalidCredentialsError";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(command: LoginUserCommand): Promise<string> {
    const user = await this.userRepository.getUserByEmail(command.email);
    if (!user) {
      throw new UserNotFoundError(command.email);
    }

    const passwordMatch = await this.passwordService.comparePasswords(command.password, user.password.value);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return this.tokenService.generateToken(user.id, user.role.value);
  }
}
