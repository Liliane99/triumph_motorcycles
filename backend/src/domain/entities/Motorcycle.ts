export class Motorcycle {
  constructor(
    public readonly id: string,
    public brand: string,
    public model: string,
    public year: number,
    public licensePlate: string,
    public kilometers: number
  ) {}
}
