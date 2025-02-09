import { Command } from "@nestjs-architects/typed-cqrs";

export class DeleteIncidentCommand extends Command<void> {
  constructor(
    public readonly id: string
  ) {
    super();
  }
}
