import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateIncidentCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly description?: string,
    public readonly status?: string
  ) {
    super();
  }
}
