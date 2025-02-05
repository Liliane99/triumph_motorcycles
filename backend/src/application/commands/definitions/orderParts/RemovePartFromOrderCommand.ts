import { Command } from "@nestjs-architects/typed-cqrs";

export class RemovePartFromOrderCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
    public readonly partId: string
  ) {
    super();
  }
}
