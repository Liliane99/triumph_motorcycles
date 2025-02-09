import { InvalidMaintenanceReferenceError } from "../../errors/maintenances/InvalidMaintenanceReferenceError";
import { Value } from "../Value";

export class MaintenanceReference implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(value: string): MaintenanceReference | InvalidMaintenanceReferenceError {
    const normalized = value.trim();
    if (!/^[A-Z0-9]{5,15}$/.test(normalized)) {
      return new InvalidMaintenanceReferenceError(normalized);
    }
    return new MaintenanceReference(normalized);
  }

  public is(item: Value<string>): boolean {
    return this.value === item.value;
  }

  public isValue(value: string): boolean {
    return this.value === value.trim();
  }
}
