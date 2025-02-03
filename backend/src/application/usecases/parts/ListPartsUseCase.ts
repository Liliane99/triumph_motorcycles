import { IPartRepository } from "../../ports/repositories/PartRepository";

export class ListPartsUseCase {
  constructor(private readonly partRepository: IPartRepository) {}

  async execute() {
    return this.partRepository.listParts();
  }
}
