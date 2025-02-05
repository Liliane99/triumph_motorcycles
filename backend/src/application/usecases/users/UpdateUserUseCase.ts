import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdateUserCommand } from "../../commands/definitions/users/UpdateUserCommand";
import { UserUpdatedEvent } from "../../../domain/events/users/UserUpdatedEvent";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";
import { EmailAlreadyExistsError } from "../../../domain/errors/users/EmailAlreadyExistsError";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const existingUser = await this.userRepository.getUserById(command.id);
    if (!existingUser) {
      throw new UserNotFoundError(command.id);
    }
    if (command.email && command.email !== existingUser.email.value) {
      const userWithSameEmail = await this.userRepository.getUserByEmail(command.email);
      if (userWithSameEmail) {
        throw new EmailAlreadyExistsError(command.email);
      }
    }

    const updatedUser = existingUser.update(
      command.username,
      command.email,
      command.role,
      command.updatedBy,
      command.phoneNumber,
      command.licenseNumber,
      command.experienceLevel
    );

    if (updatedUser instanceof Error) {
      throw updatedUser; 
    }

    await this.userRepository.updateUser(updatedUser);

    const event: UserUpdatedEvent = {
      identifier: updatedUser.id,
      type: "USER_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedUser.id,
        username: updatedUser.username.value,
        email: updatedUser.email.value,
        role: updatedUser.role.value,
        updatedAt: updatedUser.updatedAt,
        updatedBy: updatedUser.updatedBy
      }
    };

    await this.eventStore.publish(event, `user-${updatedUser.id}`);
  }
}
