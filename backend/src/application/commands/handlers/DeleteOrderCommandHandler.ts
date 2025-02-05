import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrderCommand } from "../definitions/DeleteOrderCommand";
import { DeleteOrderUseCase } from "../../usecases/orders/DeleteOrderUseCase";

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(private readonly deleteOrderUseCase: DeleteOrderUseCase) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    try {
      await this.deleteOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande :`, error);
      throw error;
    }
  }
}
