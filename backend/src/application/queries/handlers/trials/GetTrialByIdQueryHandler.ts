import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetTrialByIdQuery } from "../../definitions/trials/GetTrialByIdQuery";
import { GetTrialByIdUseCase } from "../../../usecases/trials/GetTrialByIdUseCase";

@QueryHandler(GetTrialByIdQuery)
export class GetTrialByIdQueryHandler implements IQueryHandler<GetTrialByIdQuery> {
  constructor(private readonly getTrialByIdUseCase: GetTrialByIdUseCase) {}

  async execute(query: GetTrialByIdQuery) {
    try {
      return await this.getTrialByIdUseCase.execute(query);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'essai :`, error);
      throw error;
    }
  }
}
