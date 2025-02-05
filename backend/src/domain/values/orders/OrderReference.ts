import { InvalidOrderReferenceError } from "../../errors/orders/InvalidOrderReferenceError";
import { Value } from "../Value";

export class OrderReference implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): OrderReference | InvalidOrderReferenceError {
    const normalized = value.trim();
    if (!/^[A-Z0-9]{5,15}$/.test(normalized)) {
      return new InvalidOrderReferenceError(normalized);
    }
    return new OrderReference(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
