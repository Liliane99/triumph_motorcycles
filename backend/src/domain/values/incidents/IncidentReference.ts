import { InvalidIncidentReferenceError } from "../../errors/incidents/InvalidIncidentReferenceError";
import { Value } from "../Value";

export class IncidentReference implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): IncidentReference | InvalidIncidentReferenceError {
    const normalized = value.trim();
    if (!/^[A-Z0-9]{5,15}$/.test(normalized)) {
      return new InvalidIncidentReferenceError(normalized);
    }
    return new IncidentReference(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
