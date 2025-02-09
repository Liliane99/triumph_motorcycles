import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdatePartInMaintenanceCommand extends Command<void> {
  constructor(
    public readonly maintenanceId: string,
    public readonly partId: string,
    public readonly quantityUsed: number
  ) {
    super();
  }
}
