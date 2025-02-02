import { InvalidRoleError } from "../../errors/users/InvalidRoleError";
import { Value } from "../Value";

export class Role implements Value<string> {
  private constructor(public readonly value: "manager" | "client" | "admin") {}

  public static from(value: string): Role | InvalidRoleError {
    const normalizedRole = value.trim().toLowerCase();

    if (!["manager", "client", "admin"].includes(normalizedRole)) {
      return new InvalidRoleError();
    }

    return new Role(normalizedRole as "manager" | "client" | "admin");
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim().toLowerCase();
  }
}
