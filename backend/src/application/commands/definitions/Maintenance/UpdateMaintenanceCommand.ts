export class UpdateMaintenanceCommand {
    constructor(
      public readonly id: string,
      public readonly date: Date,
      public readonly technician: string,
      public readonly recommendation: string,
      public readonly pricePartTotal: number,
      public readonly priceLabour: number
    ) {}
  }
  