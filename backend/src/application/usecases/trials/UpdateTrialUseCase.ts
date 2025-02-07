import { ITrialRepository } from "../../ports/repositories/TrialRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdateTrialCommand } from "../../commands/definitions/trials/UpdateTrialCommand";
import { TrialUpdatedEvent } from "../../../domain/events/trials/TrialUpdatedEvent";
import { TrialNotFoundError } from "../../../domain/errors/trials/TrialNotFoundError";
import { TrialStartDate } from "../../../domain/values/trials/TrialStartDate";
import { TrialEndDate } from "../../../domain/values/trials/TrialEndDate";

export class UpdateTrialUseCase {
  constructor(
    private readonly trialRepository: ITrialRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateTrialCommand): Promise<void> {
    const existingTrial = await this.trialRepository.getTrialById(command.userId, command.motorcycleId);
    if (!existingTrial) {
      throw new TrialNotFoundError(command.userId, command.motorcycleId);
    }

    const startDate = command.startDate ?? existingTrial.startDate.value;
    const endDate = command.endDate ?? existingTrial.endDate.value;

    const validStartDate = TrialStartDate.from(startDate);
    const validEndDate = TrialEndDate.from(startDate, endDate);

    if (validStartDate instanceof Error) throw validStartDate;
    if (validEndDate instanceof Error) throw validEndDate;

    const updatedTrial = existingTrial.update(
      validStartDate.value, 
      validEndDate.value,   
      command.updatedBy
    );

    if (updatedTrial instanceof Error) {
      throw updatedTrial;
    }

    await this.trialRepository.updateTrial(updatedTrial);

    const event: TrialUpdatedEvent = {
      identifier: `${command.userId}-${command.motorcycleId}`,
      type: "TRIAL_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        userId: command.userId,
        motorcycleId: command.motorcycleId,
        startDate: validStartDate.value,  
        endDate: validEndDate.value,      
        updatedBy: command.updatedBy,
        updatedAt: new Date()
      }
    };

    await this.eventStore.publish(event, `trial-${command.userId}-${command.motorcycleId}`);
  }
}
