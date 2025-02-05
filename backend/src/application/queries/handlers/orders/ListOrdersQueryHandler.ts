import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListOrdersQuery } from "../../definitions/orders/ListOrdersQuery";
import { ListOrdersUseCase } from "../../../usecases/orders/ListOrdersUseCase";

@QueryHandler(ListOrdersQuery)
export class ListOrdersQueryHandler implements IQueryHandler<ListOrdersQuery> {
  constructor(private readonly listOrdersUseCase: ListOrdersUseCase) {}

  async execute() {
    try {
      return await this.listOrdersUseCase.execute();
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes :`, error);
      throw error;
    }
  }
}
