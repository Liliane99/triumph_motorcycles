import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { IPasswordService } from "../../ports/services/AuthenticationService"; 
import { CreateUserCommand } from "../../commands/definitions/users/CreateUserCommand";
import { UserCreatedEvent } from "../../../domain/events/users/UserCreatedEvent";
import { User } from "../../../domain/entities/User";
import { EmailAlreadyExistsError } from "../../../domain/errors/users/EmailAlreadyExistsError";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventStore: IEventPublisherService,
    private readonly passwordService: IPasswordService 
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const existingUser = await this.userRepository.getUserByEmail(command.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(command.email);
    }

    const hashedPassword = await this.passwordService.hashPassword(command.password);

    const user = User.create(
      command.id,
      command.username,
      command.email,
      hashedPassword, 
      command.role,
      command.createdBy,
      command.phoneNumber,
      command.licenseNumber,
      command.experienceLevel
    );

    if (user instanceof Error) {
      throw user; 
    }

    await this.userRepository.createUser(user);

    const event: UserCreatedEvent = {
      identifier: user.id,
      type: "USER_CREATED",
      date: new Date(),
      version: 1,
      data: {
        id: user.id,
        username: user.username.value,
        email: user.email.value,
        role: user.role.value,
        createdAt: user.createdAt,
        createdBy: user.createdBy
      }
    };

    await this.eventStore.publish(event, `user-${user.id}`);
  }
}
