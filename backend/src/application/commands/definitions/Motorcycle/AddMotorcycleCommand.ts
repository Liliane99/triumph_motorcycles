export class CreateMotorcycleCommand {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly purchaseDate: Date,
    public readonly licensePlate: string,
    public readonly kilometers: number,
    public readonly warrantyDate: Date,
    public readonly maintenanceInterval: number,
    public readonly ownerId: string,
    public createdBy: string
  ) {
    console.log(" [Motorcycle] Objet avant sauvegarde:", this);
  }
}

