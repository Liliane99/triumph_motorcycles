import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddPartToOrderCommand } from "../definitions/AddPartToOrderCommand";
import { AddPartToOrderUseCase } from "../../usecases/orderParts/AddPartToOrderUseCase";

@CommandHandler(AddPartToOrderCommand)
export class AddPartToOrderCommandHandler implements ICommandHandler<AddPartToOrderCommand> {
  constructor(private readonly addPartToOrderUseCase: AddPartToOrderUseCase) {}

  async execute(command: AddPartToOrderCommand): Promise<void> {
    try {
      await this.addPartToOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la pièce à la commande :`, error);
      throw error;
    }
  }
}
