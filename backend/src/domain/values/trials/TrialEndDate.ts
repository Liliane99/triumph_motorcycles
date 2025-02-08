import { InvalidTrialEndDateError } from "../../errors/trials/InvalidTrialEndDateError";
import { Value } from "../Value";

export class TrialEndDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(startDate: unknown, endDate: unknown): TrialEndDate | Error {
    const start = TrialEndDate.parseDate(startDate);
    const end = TrialEndDate.parseDate(endDate);

    if (start instanceof Error) return start;
    if (end instanceof Error) return end;

    if (end <= start) {
      return new InvalidTrialEndDateError(end, "La date de fin ne peut pas être avant ou égale à la date de début.");
    }

    return new TrialEndDate(end);
  }

  private static parseDate(value: unknown): Date | Error {
    if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new InvalidTrialEndDateError(value);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
