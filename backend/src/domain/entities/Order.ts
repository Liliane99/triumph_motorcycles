import { OrderReference } from "../values/orders/OrderReference";
import { OrderDate } from "../values/orders/OrderDate";
import { DeliveryDate } from "../values/orders/DeliveryDate";

export class Order {
  constructor(
    public readonly id: string,
    public readonly reference: OrderReference,
    public readonly orderDate: OrderDate,
    public readonly deliveryDate: DeliveryDate | null,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  private static validateFields(
    reference: string,
    orderDate: Date,
    deliveryDate: Date | null
  ): {
    reference: OrderReference | Error;
    orderDate: OrderDate | Error;
    deliveryDate: DeliveryDate | Error | null;
  } {
    return {
      reference: OrderReference.from(reference),
      orderDate: OrderDate.from(orderDate),
      deliveryDate: deliveryDate ? DeliveryDate.from(orderDate, deliveryDate) : null,
    };
  }

  static create(
    id: string,
    reference: string,
    orderDate: Date,
    deliveryDate: Date | null,
    createdBy: string
  ): Order | Error {
    const { reference: validReference, orderDate: validOrderDate, deliveryDate: validDeliveryDate } =
      this.validateFields(reference, orderDate, deliveryDate);

    if (validReference instanceof Error) return validReference;
    if (validOrderDate instanceof Error) return validOrderDate;
    if (validDeliveryDate instanceof Error) return validDeliveryDate;

    return new Order(
      id,
      validReference,
      validOrderDate,
      validDeliveryDate,
      createdBy,
      createdBy,
      new Date(),
      new Date()
    );
  }

  update(
    deliveryDate?: Date,
    updatedBy?: string
  ): Order | Error {
    const validDeliveryDate = deliveryDate ? DeliveryDate.from(this.orderDate.value, deliveryDate) : null;
    
    if (validDeliveryDate instanceof Error) return validDeliveryDate;

    return new Order(
      this.id,
      this.reference,
      this.orderDate,
      validDeliveryDate,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
