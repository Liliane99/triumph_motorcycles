import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IPasswordService } from "../../ports/services/AuthenticationService";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdateUserPasswordCommand } from "../../commands/definitions/users/UpdateUserPasswordCommand";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";
import { InvalidCredentialsError } from "../../../domain/errors/users/InvalidCredentialsError";
import { WeakPasswordError } from "../../../domain/errors/users/WeakPasswordError";
import { UserPasswordUpdatedEvent } from "../../../domain/events/users/UserPasswordUpdatedEvent";
import { Password } from "../../../domain/values/users/Password";

export class UpdateUserPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateUserPasswordCommand): Promise<void> {
    const user = await this.userRepository.getUserById(command.id);
    if (!user) {
      throw new UserNotFoundError(command.id);
    }

    const isOldPasswordValid = await this.passwordService.comparePasswords(
      command.oldPassword,
      user.password.value
    );

    if (!isOldPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const newPasswordValidation = Password.from(command.newPassword);
    if (newPasswordValidation instanceof Error) {
      throw new WeakPasswordError();
    }

    const hashedNewPassword = await this.passwordService.hashPassword(command.newPassword);

    const updatedUser = user.update(
      undefined, 
      undefined, 
      undefined,
      command.updatedBy, 
      undefined, 
      undefined, 
      undefined 
    );

    if (updatedUser instanceof Error) {
      throw updatedUser;
    }

    await this.userRepository.updateUserPassword(command.id, hashedNewPassword);

    const event: UserPasswordUpdatedEvent = {
      identifier: updatedUser.id,
      type: "USER_PASSWORD_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedUser.id,
        updatedAt: updatedUser.updatedAt,
        updatedBy: command.updatedBy
      }
    };

    await this.eventStore.publish(event, `user-${updatedUser.id}`);
  }
}
