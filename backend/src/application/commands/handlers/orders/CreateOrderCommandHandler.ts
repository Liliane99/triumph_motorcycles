import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateOrderCommand } from "../../definitions/orders/CreateOrderCommand";
import { CreateOrderUseCase } from "../../../usecases/orders/CreateOrderUseCase";

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    try {
      await this.createOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la création de la commande :`, error);
      throw error;
    }
  }
}
