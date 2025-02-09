import { InvalidDateOfBirthError } from "../../errors/Driver/InvalidDateOfBirthError";
import { Value } from "../Value";

export class DateOfBirth implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(value: string): DateOfBirth | InvalidDateOfBirthError {
    const parsedDate = new Date(value);
    const today = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 18);

    if (isNaN(parsedDate.getTime()) || parsedDate > today || parsedDate > minAgeDate) {
      return new InvalidDateOfBirthError();
    }

    return new DateOfBirth(parsedDate);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}