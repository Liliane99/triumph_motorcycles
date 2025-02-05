import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListPartsQuery } from "../../definitions/parts/ListPartsQuery";
import { ListPartsUseCase } from "../../../../application/usecases/parts/ListPartsUseCase";

@QueryHandler(ListPartsQuery)
export class ListPartsQueryHandler implements IQueryHandler<ListPartsQuery> {
  constructor(private readonly listPartsUseCase: ListPartsUseCase) {}

  async execute() {
    try {
      return await this.listPartsUseCase.execute();
    } catch (error) {
      console.error(`Erreur lors de la récupération des pièces :`, error);
      throw error;
    }
  }
}
