import { InvalidLicenseNumberError } from "../../errors/users/InvalidLicenseNumberError";
import { Value } from "../Value";

export class LicenseNumber implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): LicenseNumber | InvalidLicenseNumberError {
    const normalizedLicense = value.trim();

    if (!/^[A-Z0-9]{8,12}$/.test(normalizedLicense)) {
      return new InvalidLicenseNumberError();
    }

    return new LicenseNumber(normalizedLicense);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
