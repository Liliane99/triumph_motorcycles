export class UpdateDriverCommand {
    constructor(
      public readonly id: string,
      public readonly licenseNumber: string,
      public readonly experienceLevel: string,
      public readonly dateOfBirth: Date,
      public readonly clientId: string,
      public readonly motorcycleId: string
    ) {}
}
