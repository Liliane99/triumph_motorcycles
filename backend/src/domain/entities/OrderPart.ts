import { QuantityOrdered } from "../values/orders/QuantityOrdered";

export class OrderPart {
  constructor(
    public readonly orderId: string,
    public readonly partId: string,
    public readonly quantityOrdered: QuantityOrdered
  ) {}

  private static validateFields(
    quantityOrdered: number
  ): { quantityOrdered: QuantityOrdered | Error } {
    return {
      quantityOrdered: QuantityOrdered.from(quantityOrdered),
    };
  }

  static create(orderId: string, partId: string, quantityOrdered: number): OrderPart | Error {
    const { quantityOrdered: validQuantityOrdered } = this.validateFields(quantityOrdered);

    if (validQuantityOrdered instanceof Error) return validQuantityOrdered;

    return new OrderPart(orderId, partId, validQuantityOrdered);
  }

  update(quantityOrdered: number): OrderPart | Error {
    const validQuantityOrdered = QuantityOrdered.from(quantityOrdered);

    if (validQuantityOrdered instanceof Error) return validQuantityOrdered;

    return new OrderPart(this.orderId, this.partId, validQuantityOrdered);
  }
}
