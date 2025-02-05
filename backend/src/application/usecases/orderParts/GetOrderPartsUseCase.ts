import { IOrderPartRepository } from "../../ports/repositories/OrderPartRepository";
import { GetOrderPartsQuery } from "../../queries/definitions/orderParts/GetOrderPartsQuery";
import { OrderNotFoundError } from "../../../domain/errors/orders/OrderNotFoundError";

export class GetOrderPartsUseCase {
  constructor(private readonly orderPartRepository: IOrderPartRepository) {}

  async execute(query: GetOrderPartsQuery) {
    const orderParts = await this.orderPartRepository.getPartsByOrderId(query.orderId);
    
    if (!orderParts || orderParts.length === 0) {
      throw new OrderNotFoundError(query.orderId);
    }

    return orderParts;
  }
}
