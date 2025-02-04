import { InvalidPartNameError } from "../../errors/parts/InvalidPartNameError";
import { Value } from "../Value";

export class PartName implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): PartName | InvalidPartNameError {
    const normalizedPartName = value.trim();

    if (normalizedPartName.length < 3) {
      return new InvalidPartNameError(value);
    }

    return new PartName(normalizedPartName);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
