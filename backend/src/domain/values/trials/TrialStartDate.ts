import { InvalidTrialStartDateError } from "../../errors/trials/InvalidTrialStartDateError";
import { Value } from "../Value";

export class TrialStartDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(value: unknown): TrialStartDate | Error {
    if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
      const date = new Date(value); 

      if (isNaN(date.getTime())) {
        return new InvalidTrialStartDateError(value);
      }

      return new TrialStartDate(date);
    }

    return new InvalidTrialStartDateError(value);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
