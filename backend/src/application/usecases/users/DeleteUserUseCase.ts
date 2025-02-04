import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeleteUserCommand } from "../../commands/definitions/DeleteUserCommand";
import { UserDeletedEvent } from "../../../domain/events/users/UserDeletedEvent";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const existingUser = await this.userRepository.getUserById(command.id);
    if (!existingUser) {
      throw new UserNotFoundError(command.id);
    }

    await this.userRepository.deleteUser(command.id);

    const event: UserDeletedEvent = {
      identifier: command.id,
      type: "USER_DELETED",
      date: new Date(),
      version: 1,
      data: {
        id: command.id,
        deletedAt: new Date(),
        deletedBy: command.deletedBy
      }
    };

    await this.eventStore.publish(event, `user-${command.id}`);
  }
}
