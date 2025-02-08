import { ITrialRepository } from "../../ports/repositories/TrialRepository";
import { GetTrialByIdQuery } from "../../queries/definitions/trials/GetTrialByIdQuery";
import { TrialNotFoundError } from "../../../domain/errors/trials/TrialNotFoundError";

export class GetTrialByIdUseCase {
  constructor(private readonly trialRepository: ITrialRepository) {}

  async execute(query: GetTrialByIdQuery) {
    const trial = await this.trialRepository.getTrialById(query.userId, query.motorcycleId);
    if (!trial) {
      throw new TrialNotFoundError(query.userId, query.motorcycleId);
    }
    return trial;
  }
}
