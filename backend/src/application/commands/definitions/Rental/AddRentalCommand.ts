export class CreateRentalCommand {
    constructor(
      public readonly reference: string,
      public readonly price: number,
      public readonly rentalDate: Date,
      public readonly clientId: string,
      public readonly motorcycleId: string
    ) {}
  }
  