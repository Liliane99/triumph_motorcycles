import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetOrderByIdQuery } from "../../definitions/orders/GetOrderByIdQuery";
import { GetOrderByIdUseCase } from "../../../usecases/orders/GetOrderByIdUseCase";

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdQueryHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(private readonly getOrderByIdUseCase: GetOrderByIdUseCase) {}

  async execute(query: GetOrderByIdQuery) {
    try {
      return await this.getOrderByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande :`, error);
      throw error;
    }
  }
}
