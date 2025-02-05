import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateOrderCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly deliveryDate?: Date,  
  ) {
    super();
  }
}
