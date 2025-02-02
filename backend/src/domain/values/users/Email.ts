import { InvalidEmailError } from "../../errors/users/InvalidEmailError";
import { Value } from "../Value";

export class Email implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): Email | InvalidEmailError {
    const normalizedEmail = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return new InvalidEmailError();
    }

    return new Email(normalizedEmail);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim().toLowerCase();
  }
}
