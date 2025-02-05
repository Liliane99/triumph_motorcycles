import { IOrderRepository } from "../../ports/repositories/OrderRepository";
import { UpdateOrderCommand } from "../../commands/definitions/orders/UpdateOrderCommand";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { OrderUpdatedEvent } from "../../../domain/events/orders/OrderUpdatedEvent";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class UpdateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: UpdateOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.getOrderById(command.id);
    if (!existingOrder) {
      throw new OrderNotFoundError(command.id);
    }

    const updatedOrder = existingOrder.update(
      command.deliveryDate,
      command.updatedBy
    );

    if (updatedOrder instanceof Error) {
      throw updatedOrder;
    }

    await this.orderRepository.updateOrder(updatedOrder);

    const event: OrderUpdatedEvent = {
      identifier: updatedOrder.id,
      type: "ORDER_UPDATED",
      date: new Date(),
      version: 1,
      data: {
        id: updatedOrder.id,
        orderDate: updatedOrder.orderDate.value,  
        deliveryDate: updatedOrder.deliveryDate ? updatedOrder.deliveryDate.value : null,  
        updatedBy: updatedOrder.updatedBy,
        updatedAt: updatedOrder.updatedAt,
      }
    };

    await this.eventStore.publish(event, `order-${updatedOrder.id}`);
  }
}
