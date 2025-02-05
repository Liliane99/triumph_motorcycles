import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { IEmailService } from "../../ports/services/IEmailService";
import { IUserRepository } from "../../ports/repositories/UserRepository";
import { UpdatePartCommand } from "../../commands/definitions/parts/UpdatePartCommand";
import { PartUpdatedEvent } from "../../../domain/events/parts/PartUpdatedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";

export class UpdatePartUseCase {
  constructor(
    private readonly partRepository: IPartRepository,
    private readonly userRepository: IUserRepository,
    private readonly eventStore: IEventPublisherService,
    private readonly emailService: IEmailService
  ) {}

  async execute(command: UpdatePartCommand): Promise<void> {
    const existingPart = await this.partRepository.getPartById(command.id);
    if (!existingPart) {
      throw new PartNotFoundError(command.id);
    }

    const updatedPart = existingPart.update(
      command.name,
      command.quantityInStock,
      command.partThreshold,
      command.unitPrice,
      command.updatedBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: PartUpdatedEvent = {
      identifier: updatedPart.id,
      type: "PART_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedPart.id,
        name: updatedPart.name.value,
        quantityInStock: updatedPart.quantityInStock.value,
        partThreshold: updatedPart.partThreshold.value,
        unitPrice: updatedPart.unitPrice.value,
        updatedAt: updatedPart.updatedAt,
        updatedBy: updatedPart.updatedBy
      }
    };

    await this.eventStore.publish(event, `part-${updatedPart.id}`);

    if (updatedPart.quantityInStock.value <= updatedPart.partThreshold.value) {
      const creatorId = updatedPart.createdBy; 
      const creator = await this.userRepository.getUserById(creatorId);

      if (!creator) {
        throw new UserNotFoundError(creatorId); 
      }

      await this.emailService.sendLowStockAlert(
        creator.email.value,
        updatedPart.name.value,
        updatedPart.quantityInStock.value
      );
    }
  }
}
