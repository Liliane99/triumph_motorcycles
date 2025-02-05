export class UpdateRentalCommand {
    constructor(
      public readonly id: string,
      public readonly reference: string,
      public readonly rentalDate: Date,
      public readonly price: number,
      public readonly clientId: string,
      public readonly motorcycleId: string
    ) {}
  }
  