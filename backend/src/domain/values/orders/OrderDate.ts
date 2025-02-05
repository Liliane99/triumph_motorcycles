import { InvalidOrderDateError } from "../../errors/orders/InvalidOrderDateError";
import { Value } from "../Value";

export class OrderDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(value: Date): OrderDate | InvalidOrderDateError {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return new InvalidOrderDateError(value);
    }
    return new OrderDate(value);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
