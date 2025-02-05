import { InvalidQuantityOrderedError } from "../../errors/orders/InvalidQuantityOrderedError";
import { Value } from "../Value";

export class QuantityOrdered implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(value: number): QuantityOrdered | InvalidQuantityOrderedError {
    if (value <= 0) {
      return new InvalidQuantityOrderedError(value);
    }
    return new QuantityOrdered(value);
  }

  public is(item: Value<number>): boolean {
    return this.value === item.value;
  }

  public isValue(value: number): boolean {
    return this.value === value;
  }
}
