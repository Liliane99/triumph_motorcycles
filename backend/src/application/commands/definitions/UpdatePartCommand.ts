import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdatePartCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly quantityInStock?: number,
    public readonly partThreshold?: number,
    public readonly unitPrice?: number
  ) {
    super();
  }
}
