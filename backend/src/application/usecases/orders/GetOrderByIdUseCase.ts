import { IOrderRepository } from "../../ports/repositories/OrderRepository";
import { GetOrderByIdQuery } from "../../queries/definitions/GetOrderByIdQuery";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrderByIdQuery) {
    const order = await this.orderRepository.getOrderById(query.id);
    if (!order) {
      throw new OrderNotFoundError(query.id);
    }
    return order;
  }
}
