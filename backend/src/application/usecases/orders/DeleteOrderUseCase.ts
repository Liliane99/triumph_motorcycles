import { IOrderRepository } from "../../ports/repositories/OrderRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { DeleteOrderCommand } from "../../commands/definitions/orders/DeleteOrderCommand";
import { OrderDeletedEvent } from "../../../domain/events/orders/OrderDeletedEvent";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class DeleteOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.getOrderById(command.id);
    if (!existingOrder) {
      throw new OrderNotFoundError(command.id);
    }

    await this.orderRepository.deleteOrder(command.id);

    const event: OrderDeletedEvent = {
      identifier: command.id,
      type: "ORDER_DELETED",
      date: new Date(),
      version: 1,
      data: {
        id: command.id
      }
    };

    await this.eventStore.publish(event, `order-${command.id}`);
  }
}
