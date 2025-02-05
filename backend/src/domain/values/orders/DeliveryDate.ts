import { InvalidDeliveryDateError } from "../../errors/orders/InvalidDeliveryDateError";
import { Value } from "../Value";

export class DeliveryDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(orderDate: Date, deliveryDate: Date): DeliveryDate | InvalidDeliveryDateError {
    if (!(deliveryDate instanceof Date) || isNaN(deliveryDate.getTime())) {
      return new InvalidDeliveryDateError(deliveryDate);
    }
    
    if (deliveryDate < orderDate) {
      return new InvalidDeliveryDateError(`La date de livraison (${deliveryDate}) ne peut pas être antérieure à la date de commande (${orderDate}).`);
    }

    return new DeliveryDate(deliveryDate);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
