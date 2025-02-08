import { ITrialRepository } from "../../ports/repositories/TrialRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeleteTrialCommand } from "../../commands/definitions/trials/DeleteTrialCommand";
import { TrialDeletedEvent } from "../../../domain/events/trials/TrialDeletedEvent";
import { TrialNotFoundError } from "../../../domain/errors/trials/TrialNotFoundError";

export class DeleteTrialUseCase {
  constructor(
    private readonly trialRepository: ITrialRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeleteTrialCommand): Promise<void> {
    const existingTrial = await this.trialRepository.getTrialById(command.userId, command.motorcycleId);
    if (!existingTrial) {
      throw new TrialNotFoundError(command.userId, command.motorcycleId);
    }

    await this.trialRepository.deleteTrial(command.userId, command.motorcycleId);

    const event: TrialDeletedEvent = {
      identifier: `${command.userId}-${command.motorcycleId}`,
      type: "TRIAL_DELETED",
      date: new Date(),
      version: 1,
      data: {
        userId: command.userId,
        motorcycleId: command.motorcycleId
      }
    };

    await this.eventStore.publish(event, `trial-${command.userId}-${command.motorcycleId}`);
  }
}
