export class CreateRentalCommand {
    constructor(
      public readonly reference: string,
      public readonly rentalDate: Date,
      public readonly price: number,
      public readonly clientId: string,
      public readonly motorcycleId: string,
      public createdBy: string
    ) {}
  }
  