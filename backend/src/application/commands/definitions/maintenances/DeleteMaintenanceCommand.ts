import { Command } from "@nestjs-architects/typed-cqrs";

export class DeleteMaintenanceCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
