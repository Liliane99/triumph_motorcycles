import { InvalidUsernameError } from "../../errors/users/InvalidUsernameError";
import { Value } from "../Value";

export class Username implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): Username | InvalidUsernameError {
    const normalizedUsername = value.trim();

    if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
      return new InvalidUsernameError();
    }

    return new Username(normalizedUsername);
  }

  public is(item: Value<string>): boolean {
    return this.value.toLowerCase() === item.value.toLowerCase();
  }

  public isValue(value: string): boolean {
    return this.value.toLowerCase() === value.trim().toLowerCase();
  }
}
