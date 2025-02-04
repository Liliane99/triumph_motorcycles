import { IPartRepository } from "../../ports/repositories/PartRepository";
import { GetPartByIdQuery } from "../../queries/definitions/GetPartByIdQuery";
import { PartNotFoundError } from "../../../domain/errors/parts/PartNotFoundError";

export class GetPartByIdUseCase {
  constructor(private readonly partRepository: IPartRepository) {}

  async execute(query: GetPartByIdQuery) {
    const part = await this.partRepository.getPartById(query.id);
    if (!part) {
      throw new PartNotFoundError(query.id);
    }
    return part;
  }
}
