export class CreateMotorcycleCommand {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly purchaseDate: Date,
    public readonly licensePlate: string,
    public readonly kilometers: number,
    public readonly warrantyDate: Date,
    public readonly maintenanceInterval: number
  ) {}
}

