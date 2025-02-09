import { InvalidIncidentStatusError } from "../../errors/incidents/InvalidIncidentStatusError";
import { Value } from "../Value";

export class IncidentStatus implements Value<string> {
  private constructor(public readonly value: string) {}

  private static validStatuses = ["opened", "resolved"];

  public static from(value: string): IncidentStatus | InvalidIncidentStatusError {
    const normalized = value.trim().toLowerCase();
    if (!this.validStatuses.includes(normalized)) {
      return new InvalidIncidentStatusError(normalized);
    }
    return new IncidentStatus(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim().toLowerCase();
  }
}
