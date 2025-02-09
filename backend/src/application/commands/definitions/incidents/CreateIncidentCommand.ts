import { Command } from "@nestjs-architects/typed-cqrs";

export class CreateIncidentCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly reference: string,
    public readonly description: string,
    public readonly motorcycleId: string,
    public readonly createdBy: string
  ) {
    super();
  }
}
