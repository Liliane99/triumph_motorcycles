import { InvalidPartTypeError } from "../../errors/parts/InvalidPartTypeError";
import { Value } from "../Value";

export class PartType implements Value<string> {
  private constructor(public readonly value: string) {}

  private static validTypes = ["oil", "tire", "brake", "filter", "chain", "battery"];

  public static from(value: string): PartType | InvalidPartTypeError {
    const normalized = value.trim().toLowerCase();
    if (!this.validTypes.includes(normalized)) {
      return new InvalidPartTypeError(normalized);
    }
    return new PartType(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim().toLowerCase();
  }
}
