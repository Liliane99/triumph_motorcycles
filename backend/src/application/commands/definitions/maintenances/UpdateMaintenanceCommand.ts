import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateMaintenanceCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly recommendation?: string,
    public readonly date?: Date
  ) {
    super();
  }
}
