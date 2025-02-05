import { IOrderRepository } from "../../ports/repositories/OrderRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { CreateOrderCommand } from "../../commands/definitions/CreateOrderCommand";
import { OrderCreatedEvent } from "../../../domain/events/orders/OrderCreatedEvent";
import { Order } from "../../../domain/entities/Order";
import { OrderAlreadyExistsError } from "../../../domain/errors/orders/OrderAlreadyExistsError";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.getOrderByReference(command.reference);
    if (existingOrder) {
      throw new OrderAlreadyExistsError(command.reference);
    }

    const order = Order.create(
      command.id,
      command.reference,
      command.orderDate,
      command.deliveryDate ?? null, 
      command.createdBy
    );

    if (order instanceof Error) {
      throw order;
    }

    await this.orderRepository.createOrder(order);

    const event: OrderCreatedEvent = {
      identifier: order.id,
      type: "ORDER_CREATED",
      date: new Date(),
      version: 1,
      data: {
        id: order.id,
        reference: order.reference.value, 
        orderDate: order.orderDate.value, 
        deliveryDate: order.deliveryDate?.value ?? null, 
        createdBy: order.createdBy,
        createdAt: order.createdAt,
      }
    };

    await this.eventStore.publish(event, `order-${order.id}`);
  }
}
