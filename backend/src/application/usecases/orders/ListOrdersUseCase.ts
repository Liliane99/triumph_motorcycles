import { IOrderRepository } from "../../ports/repositories/OrderRepository";

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute() {
    return this.orderRepository.listOrders();
  }
}
