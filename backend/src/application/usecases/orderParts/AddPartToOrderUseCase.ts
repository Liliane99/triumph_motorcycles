import { IOrderRepository } from "../../ports/repositories/OrderRepository";
import { IOrderPartRepository } from "../../ports/repositories/OrderPartRepository";
import { IPartRepository } from "../../ports/repositories/PartRepository";
import { IEventPublisherService } from "../../ports/services/EventPublisherService";
import { AddPartToOrderCommand } from "../../commands/definitions/orderParts/AddPartToOrderCommand";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";
import { OrderPartAddedEvent } from "../../../domain/events/orderParts/OrderPartAddedEvent";
import { OrderPart } from "../../../domain/entities/OrderPart";

export class AddPartToOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,  
    private readonly orderPartRepository: IOrderPartRepository,
    private readonly partRepository: IPartRepository,
    private readonly eventStore: IEventPublisherService
  ) {}

  async execute(command: AddPartToOrderCommand): Promise<void> {
    const part = await this.partRepository.getPartById(command.partId);
    if (!part) {
      throw new PartNotFoundError(command.partId);
    }

    const order = await this.orderRepository.getOrderById(command.orderId);  
    if (!order) {
      throw new OrderNotFoundError(command.orderId);
    }

    const orderPart = OrderPart.create(
      command.orderId,
      command.partId,
      command.quantityOrdered
    );
    
    if (orderPart instanceof Error) {
      throw orderPart; 
    }
    
    await this.orderPartRepository.addPartToOrder(orderPart);
     

    const updatedPart = part.update(
      part.name.value,
      part.quantityInStock.value + command.quantityOrdered, 
      part.partThreshold.value,
      part.unitPrice.value,
      order.createdBy
    );

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partRepository.updatePart(updatedPart);

    const event: OrderPartAddedEvent = {
      identifier: `${command.orderId}-${command.partId}`,
      type: "ORDER_PART_ADDED",
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
