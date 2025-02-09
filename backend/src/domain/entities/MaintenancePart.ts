import { QuantityUsed } from "../values/maintenances/QuantityUsed";

export class MaintenancePart {
  constructor(
    public readonly maintenanceId: string,
    public readonly partId: string,
    public readonly quantityUsed: QuantityUsed
  ) {}

  private static validateFields(
    quantityUsed: number
  ): { quantityUsed: QuantityUsed | Error } {
    return {
      quantityUsed: QuantityUsed.from(quantityUsed),
    };
  }

  static create(maintenanceId: string, partId: string, quantityUsed: number): MaintenancePart | Error {
    const { quantityUsed: validQuantityUsed } = this.validateFields(quantityUsed);

    if (validQuantityUsed instanceof Error) return validQuantityUsed;

    return new MaintenancePart(maintenanceId, partId, validQuantityUsed);
  }

  update(quantityUsed: number): MaintenancePart | Error {
    const validQuantityUsed = QuantityUsed.from(quantityUsed);

    if (validQuantityUsed instanceof Error) return validQuantityUsed;

    return new MaintenancePart(this.maintenanceId, this.partId, validQuantityUsed);
  }
}
