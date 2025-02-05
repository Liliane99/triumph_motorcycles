import { Command } from "@nestjs-architects/typed-cqrs";

export class CreatePartCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly reference: string,
    public readonly type: string,
    public readonly name: string,
    public readonly quantityInStock: number,
    public readonly partThreshold: number,
    public readonly unitPrice: number,
    public readonly createdBy: string
  ) {
    super();
  }
}
