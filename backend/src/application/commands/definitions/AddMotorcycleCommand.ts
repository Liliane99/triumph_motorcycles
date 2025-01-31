export class CreateMotorcycleCommand {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly licensePlate: string,
    public readonly kilometers: number
  ) {}
}
