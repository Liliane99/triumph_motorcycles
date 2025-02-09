import { Command } from "@nestjs-architects/typed-cqrs";

export class CreateMaintenanceCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly reference: string,
    public readonly date: Date,
    public readonly recommendation: string,
    public readonly motorcycleId: string,
    public readonly createdBy: string
  ) {
    super();
  }
}
