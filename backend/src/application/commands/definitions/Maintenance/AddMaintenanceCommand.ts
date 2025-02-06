export class CreateMaintenanceCommand {
    constructor(
      public readonly reference: string,
      public readonly date: Date,
      public readonly technician: string,
      public readonly recommendation: string,
      public readonly pricePartTotal: number,
      public readonly priceLabour: number,
      public readonly motorcycleId: string,
      public readonly partId: string
    ) {}
  }
  