import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateTrialCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly motorcycleId: string,
    public readonly updatedBy: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date
  ) {
    super();
  }
}
