import { InvalidPhoneNumberError } from "../../errors/users/InvalidPhoneNumberError";
import { Value } from "../Value";

export class PhoneNumber implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): PhoneNumber | InvalidPhoneNumberError {
    const normalizedNumber = value.trim();

    if (!/^\+?[1-9]\d{1,14}$/.test(normalizedNumber)) {
      return new InvalidPhoneNumberError();
    }

    return new PhoneNumber(normalizedNumber);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
