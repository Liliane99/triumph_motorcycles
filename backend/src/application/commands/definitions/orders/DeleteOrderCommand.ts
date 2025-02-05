import { Command } from "@nestjs-architects/typed-cqrs";

export class DeleteOrderCommand extends Command<void> {
  constructor(
    public readonly id: string
  ) {
    super();
  }
}
