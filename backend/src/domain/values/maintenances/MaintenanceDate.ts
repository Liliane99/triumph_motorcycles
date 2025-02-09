import { InvalidMaintenanceDateError } from "../../errors/maintenances/InvalidMaintenanceDateError";
import { Value } from "../Value";

export class MaintenanceDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(value: Date): MaintenanceDate | InvalidMaintenanceDateError {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return new InvalidMaintenanceDateError(value);
    }
    return new MaintenanceDate(value);
  }

  public is(item: Value<Date>): boolean {
    return this.value.getTime() === item.value.getTime();
  }

  public isValue(value: Date): boolean {
    return this.value.getTime() === value.getTime();
  }
}
