import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetPartByIdQuery } from "../../definitions/parts/GetPartByIdQuery";
import { GetPartByIdUseCase } from "../../../../application/usecases/parts/GetPartByIdUseCase";

@QueryHandler(GetPartByIdQuery)
export class GetPartByIdQueryHandler implements IQueryHandler<GetPartByIdQuery> {
  constructor(private readonly getPartByIdUseCase: GetPartByIdUseCase) {}

  async execute(query: GetPartByIdQuery) {
    try {
      return await this.getPartByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la pièce :`, error);
      throw error;
    }
  }
}
