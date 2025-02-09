import { InvalidQuantityUsedError } from "../../errors/maintenances/InvalidQuantityUsedError";
import { Value } from "../Value";

export class QuantityUsed implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(value: number): QuantityUsed | InvalidQuantityUsedError {
    if (value <= 0) {
      return new InvalidQuantityUsedError(value);
    }
    return new QuantityUsed(value);
  }

  public is(item: Value<number>): boolean {
    return this.value === item.value;
  }

  public isValue(value: number): boolean {
    return this.value === value;
  }
}
