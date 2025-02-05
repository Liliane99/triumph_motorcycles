import { InvalidQuantityError } from "../../errors/parts/InvalidQuantityError";
import { Value } from "../Value";

export class Quantity implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(value: number): Quantity | InvalidQuantityError {
    if (value < 0) {
      return new InvalidQuantityError(value);
    }
    return new Quantity(value);
  }

  public is(item: Value<number>): boolean {
    return this.value === item.value;
  }

  public isValue(value: number): boolean {
    return this.value === value;
  }
}
