import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetOrderPartsQuery } from "../definitions/GetOrderPartsQuery";
import { GetOrderPartsUseCase } from "../../usecases/orderParts/GetOrderPartsUseCase";

@QueryHandler(GetOrderPartsQuery)
export class GetOrderPartsQueryHandler implements IQueryHandler<GetOrderPartsQuery> {
  constructor(private readonly getOrderPartsUseCase: GetOrderPartsUseCase) {}

  async execute(query: GetOrderPartsQuery) {
    try {
      return await this.getOrderPartsUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération des pièces d'une commande :`, error);
      throw error;
    }
  }
}
