import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ListTrialsQuery } from "../../definitions/trials/ListTrialsQuery";
import { ListTrialsUseCase } from "../../../usecases/trials/ListTrialsUseCase";

@QueryHandler(ListTrialsQuery)
export class ListTrialsQueryHandler implements IQueryHandler<ListTrialsQuery> {
  constructor(private readonly listTrialsUseCase: ListTrialsUseCase) {}

  async execute() {
    try {
      return await this.listTrialsUseCase.execute();
    } catch (error) {
      console.error(`Erreur lors de la récupération des essais :`, error);
      throw error;
    }
  }
}
