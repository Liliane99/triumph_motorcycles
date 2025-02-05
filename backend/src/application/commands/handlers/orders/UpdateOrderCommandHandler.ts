import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateOrderCommand } from "../../definitions/orders/UpdateOrderCommand";
import { UpdateOrderUseCase } from "../../../usecases/orders/UpdateOrderUseCase";

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderCommandHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(private readonly updateOrderUseCase: UpdateOrderUseCase) {}

  async execute(command: UpdateOrderCommand): Promise<void> {
    try {
      await this.updateOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande :`, error);
      throw error;
    }
  }
}
