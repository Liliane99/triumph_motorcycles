export class MaintenanceInterval {
  private readonly value: number;

  constructor(value: number) {
    if (value <= 0) {
      throw new Error("Maintenance interval must be greater than zero.");
    }
    this.value = value;
  }

  get(): number {
    return this.value;
  }
}