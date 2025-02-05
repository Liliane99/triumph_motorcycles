import { IOrderRepository } from "../../ports/repositories/OrderRepository"; 
import { IOrderPartRepository } from "../../ports/repositories/OrderPartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { UpdatePartInOrderCommand } from "../../commands/definitions/UpdatePartInOrderCommand";
import { OrderPartUpdatedEvent } from "../../../domain/events/orderParts/OrderPartUpdatedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class UpdatePartInOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository, 
    private readonly orderPartRepository: IOrderPartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdatePartInOrderCommand): Promise<void> {
    const part = await this.partRepository.getPartById(command.partId);
    if (!part) {
      throw new PartNotFoundError(command.partId);
    }

    const order = await this.orderRepository.getOrderById(command.orderId); // Correction ici
    if (!order) {
      throw new OrderNotFoundError(command.orderId);
    }

    const existingOrderPart = await this.orderPartRepository.getOrderPart(command.orderId, command.partId);
    if (!existingOrderPart) {
      throw new Error(`La pièce ${command.partId} n'existe pas dans l'ordre ${command.orderId}.`);
    }

    const oldQuantityOrdered = existingOrderPart.quantityOrdered.value; // Correction ici

    await this.orderPartRepository.updatePartInOrder(
      command.orderId,
      command.partId,
      command.quantityOrdered
    );

    const stockDifference = command.quantityOrdered - oldQuantityOrdered;
    const updatedPart = part.update(
      part.name.value,
      part.quantityInStock.value + stockDifference, 
      part.partThreshold.value,
      part.unitPrice.value,
      order.createdBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: OrderPartUpdatedEvent = {
      identifier: `${command.orderId}-${command.partId}`,
      type: "ORDER_PART_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        orderId: command.orderId,
        partId: command.partId,
        quantityOrdered: command.quantityOrdered
      }
    };

    await this.eventStore.publish(event, `orderPart-${command.orderId}-${command.partId}`);
  }
}
