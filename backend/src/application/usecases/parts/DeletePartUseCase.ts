import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeletePartCommand } from "../../commands/definitions/DeletePartCommand";
import { PartDeletedEvent } from "../../../domain/events/parts/PartDeletedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";

export class DeletePartUseCase {
  constructor(
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeletePartCommand): Promise<void> {
    const existingPart = await this.partRepository.getPartById(command.id);
    if (!existingPart) {
      throw new PartNotFoundError(command.id);
    }

    await this.partRepository.deletePart(command.id);

    const event: PartDeletedEvent = {
      identifier: command.id,
      type: "PART_DELETED",
      date: new Date(),
      version: 1,
      data: {
        id: command.id,
        deletedAt: new Date(),
        deletedBy: command.deletedBy
      }
    };

    await this.eventStore.publish(event, `part-${command.id}`);
  }
}
