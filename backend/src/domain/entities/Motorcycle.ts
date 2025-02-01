export class Motorcycle {
  constructor(
    public readonly id: string,
    public brand: string,
    public model: string,
    public date: Date,
    public licensePlate: string,
    public kilometers: number,
    public warranty: Date,  
    public maintenanceInterval: number
  ) {}
}
