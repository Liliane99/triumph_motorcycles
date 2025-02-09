import { InvalidIncidentDescriptionError } from "../../errors/incidents/InvalidIncidentDescriptionError";
import { Value } from "../Value";

export class IncidentDescription implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: unknown): IncidentDescription | InvalidIncidentDescriptionError {
    if (typeof value !== "string") {
      return new InvalidIncidentDescriptionError(String(value)); 
    }

    const normalized = value.trim();

    if (normalized.length < 5) {
      return new InvalidIncidentDescriptionError(value);
    }

    return new IncidentDescription(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
