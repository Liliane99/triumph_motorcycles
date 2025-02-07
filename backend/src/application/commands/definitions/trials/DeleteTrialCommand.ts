import { Command } from "@nestjs-architects/typed-cqrs";

export class DeleteTrialCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly motorcycleId: string
  ) {
    super();
  }
}
