import { InvalidPartReferenceError } from "../../errors/parts/InvalidPartReferenceError";
import { Value } from "../Value";

export class PartReference implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): PartReference | InvalidPartReferenceError {
    const normalized = value.trim();
    if (!/^[A-Z0-9]{5,15}$/.test(normalized)) {
      return new InvalidPartReferenceError(normalized);
    }
    return new PartReference(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
