import { IOrderRepository } from "../../ports/repositories/OrderRepository"; 
import { IOrderPartRepository } from "../../ports/repositories/OrderPartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { RemovePartFromOrderCommand } from "../../commands/definitions/orderParts/RemovePartFromOrderCommand";
import { OrderPartRemovedEvent } from "../../../domain/events/orderParts/OrderPartRemovedEvent";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class RemovePartFromOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository, 
    private readonly orderPartRepository: IOrderPartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: RemovePartFromOrderCommand): Promise<void> {
    const part = await this.partRepository.getPartById(command.partId);
    if (!part) {
      throw new PartNotFoundError(command.partId);
    }

    const order = await this.orderRepository.getOrderById(command.orderId); 
    if (!order) {
      throw new OrderNotFoundError(command.orderId);
    }

    const existingOrderPart = await this.orderPartRepository.getOrderPart(command.orderId, command.partId);
    if (!existingOrderPart) {
      throw new Error(`La pièce ${command.partId} n'existe pas dans l'ordre ${command.orderId}.`);
    }

    const quantityOrdered = existingOrderPart.quantityOrdered.value; 

    await this.orderPartRepository.removePartFromOrder(command.orderId, command.partId);

    const updatedPart = part.update(
      part.name.value,
      part.quantityInStock.value - quantityOrdered, 
      part.partThreshold.value,
      part.unitPrice.value,
      order.createdBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: OrderPartRemovedEvent = {
      identifier: `${command.orderId}-${command.partId}`,
      type: "ORDER_PART_REMOVED",
      date: new Date(),
      version: 1,
      data: {
        orderId: command.orderId,
        partId: command.partId,
        quantityRemoved: quantityOrdered 
      }
    };

    await this.eventStore.publish(event, `orderPart-${command.orderId}-${command.partId}`);
  }
}
