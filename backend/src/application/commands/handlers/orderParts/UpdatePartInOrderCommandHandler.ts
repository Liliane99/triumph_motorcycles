import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePartInOrderCommand } from "../../definitions/orderParts/UpdatePartInOrderCommand";
import { UpdatePartInOrderUseCase } from "../../../usecases/orderParts/UpdatePartInOrderUseCase";

@CommandHandler(UpdatePartInOrderCommand)
export class UpdatePartInOrderCommandHandler implements ICommandHandler<UpdatePartInOrderCommand> {
  constructor(private readonly updatePartInOrderUseCase: UpdatePartInOrderUseCase) {}

  async execute(command: UpdatePartInOrderCommand): Promise<void> {
    try {
      await this.updatePartInOrderUseCase.execute(command);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la pièce dans la commande :`, error);
      throw error;
    }
  }
}
