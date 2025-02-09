import { InvalidIncidentDateError } from "../../errors/incidents/InvalidIncidentDateError";
import { Value } from "../Value";

export class IncidentDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(value: unknown): IncidentDate | InvalidIncidentDateError {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return new InvalidIncidentDateError(value);
    }

    return new IncidentDate(value);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
