import { InvalidPriceError } from "../../errors/parts/InvalidPriceError";
import { Value } from "../Value";

export class Price implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(value: number): Price | InvalidPriceError {
    if (value <= 0) {
      return new InvalidPriceError(value);
    }
    return new Price(value);
  }

  public is(item: Value<number>): boolean {
    return this.value === item.value;
  }

  public isValue(value: number): boolean {
    return this.value === value;
  }
}
