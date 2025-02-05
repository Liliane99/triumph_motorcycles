import { Command } from "@nestjs-architects/typed-cqrs";

export class CreateOrderCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly reference: string,
    public readonly orderDate: Date,
    public readonly createdBy: string,
    public readonly deliveryDate?: Date | null,
  ) {
    super();
  }
}
