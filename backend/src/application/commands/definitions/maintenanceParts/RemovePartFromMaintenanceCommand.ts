import { Command } from "@nestjs-architects/typed-cqrs";

export class RemovePartFromMaintenanceCommand extends Command<void> {
  constructor(
    public readonly maintenanceId: string,
    public readonly partId: string
  ) {
    super();
  }
}
