import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { CreatePartCommand } from "../../commands/definitions/parts/CreatePartCommand";
import { PartCreatedEvent } from "../../../domain/events/parts/PartCreatedEvent";
import { Part } from "../../../domain/entities/Part";
import { PartAlreadyExistsError } from "../../../domain/errors/parts/PartAlreadyExistsError";

export class CreatePartUseCase {
  constructor(
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: CreatePartCommand): Promise<void> {
    const existingPart = await this.partRepository.getPartByReference(command.reference);
    if (existingPart) {
      throw new PartAlreadyExistsError(command.reference);
    }

    const part = Part.create(
      command.id,
      command.reference,
      command.type,
      command.name,
      command.quantityInStock,
      command.partThreshold,
      command.unitPrice,
      command.createdBy
    );

    if (part instanceof Error) {
      throw part;
    }

    await this.partRepository.createPart(part);

    const event: PartCreatedEvent = {
      identifier: part.id,
      type: "PART_CREATED",
      date: new Date(),
      version: 1,
      data: {
        id: part.id,
        reference: part.reference.value,
        type: part.type.value,
        name: part.name.value,
        quantityInStock: part.quantityInStock.value,
        partThreshold: part.partThreshold.value,
        unitPrice: part.unitPrice.value,
        createdAt: part.createdAt,
        createdBy: part.createdBy
      }
    };

    await this.eventStore.publish(event, `part-${part.id}`);
  }
}
