import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListUsersQuery } from "../../definitions/users/ListUsersQuery";
import { ListUsersUseCase } from "../../../../application/usecases/users/ListUsersUseCase";

@QueryHandler(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery> {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  async execute(query: ListUsersQuery) {
    try {
      return await this.listUsersUseCase.execute(query.roleFilter);
    } catch (error) {
      console.error(`Erreur lors de la récupération des utilisateurs :`, error);
      throw error;
    }
  }
}
