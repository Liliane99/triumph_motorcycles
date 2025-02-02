import { WeakPasswordError } from "../../errors/users/WeakPasswordError";
import { Value } from "../Value";

export class Password implements Value<string> {
  private constructor(public readonly value: string, public readonly hashed: string) {}

  public static from(value: string): Password | WeakPasswordError {
    const normalizedPassword = value.trim();

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(normalizedPassword)) {
      return new WeakPasswordError();
    }

    return new Password(normalizedPassword, normalizedPassword); 
  }

  public static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, hashedPassword); 
  }

  public is(item: Value<string>): boolean {
    return this.hashed === item.value;
  }

  public isValue(value: string): boolean {
    return this.hashed === value.trim();
  }
}
