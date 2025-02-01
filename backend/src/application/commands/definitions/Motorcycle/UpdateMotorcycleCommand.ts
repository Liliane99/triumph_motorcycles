export class UpdateMotorcycleCommand {
  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly date: Date,
    public readonly licensePlate: string,
    public readonly kilometers: number,
    public readonly warranty: Date,
    public readonly maintenanceInterval: number
  ) {}
}
