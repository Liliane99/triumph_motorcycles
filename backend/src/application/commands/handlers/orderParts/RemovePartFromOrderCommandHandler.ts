import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemovePartFromOrderCommand } from "../../definitions/orderParts/RemovePartFromOrderCommand";
import { RemovePartFromOrderUseCase } from "../../../usecases/orderParts/RemovePartFromOrderUseCase";

@CommandHandler(RemovePartFromOrderCommand)
export class RemovePartFromOrderCommandHandler implements ICommandHandler<RemovePartFromOrderCommand> {
  constructor(private readonly removePartFromOrderUseCase: RemovePartFromOrderUseCase) {}

  async execute(command: RemovePartFromOrderCommand): Promise<void> {
    try {
      await this.removePartFromOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la pièce de la commande :`, error);
      throw error;
    }
  }
}
