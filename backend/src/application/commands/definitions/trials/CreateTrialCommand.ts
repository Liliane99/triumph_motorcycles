import { Command } from "@nestjs-architects/typed-cqrs";

export class CreateTrialCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly motorcycleId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly createdBy: string
  ) {
    super();
  }
}
