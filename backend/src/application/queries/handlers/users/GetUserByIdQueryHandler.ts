import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../../definitions/users/GetUserByIdQuery";
import { GetUserByIdUseCase } from "../../../../application/usecases/users/GetUserByIdUseCase";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  async execute(query: GetUserByIdQuery) {
    try {
      return await this.getUserByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur :`, error);
      throw error;
    }
  }
}
