import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdatePartInOrderCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
    public readonly partId: string,
    public readonly quantityOrdered: number
  ) {
    super();
  }
}
