import { ITrialRepository } from "../../ports/repositories/TrialRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { IUserRepository } from "../../ports/repositories/UserRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { CreateTrialCommand } from "../../commands/definitions/trials/CreateTrialCommand";
import { TrialCreatedEvent } from "../../../domain/events/trials/TrialCreatedEvent";
import { Trial } from "../../../domain/entities/Trial";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";

export class CreateTrialUseCase {
  constructor(
    private readonly trialRepository: ITrialRepository,
    private readonly userRepository: IUserRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: CreateTrialCommand): Promise<void> {
    const user = await this.userRepository.getUserById(command.userId);
    if (!user) {
      throw new UserNotFoundError(command.userId);
    }

    const trial = Trial.create(
      command.userId,
      command.motorcycleId,
      command.startDate,
      command.endDate,
      command.createdBy
    );

    if (trial instanceof Error) {
      throw trial;
    }

    await this.trialRepository.createTrial(trial);

    const event: TrialCreatedEvent = {
      identifier: `${command.userId}-${command.motorcycleId}`,
      type: "TRIAL_CREATED",
      date: new Date(),
      version: 1,
      data: {
        userId: command.userId,
        motorcycleId: command.motorcycleId,
        startDate: command.startDate,
        endDate: command.endDate,
        createdBy: command.createdBy,
        createdAt: new Date()
      }
    };

    await this.eventStore.publish(event, `trial-${command.userId}-${command.motorcycleId}`);
  }
}
