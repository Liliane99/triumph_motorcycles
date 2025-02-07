import { ITrialRepository } from "../../ports/repositories/TrialRepository";

export class ListTrialsUseCase {
  constructor(private readonly trialRepository: ITrialRepository) {}

  async execute() {
    return this.trialRepository.listTrials();
  }
}
