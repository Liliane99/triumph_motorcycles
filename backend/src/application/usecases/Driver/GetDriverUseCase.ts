import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { GetDriverQuery } from "../../queries/definitions/Driver/GetDriverQuery";
import { Driver } from "../../../domain/entities/Driver";

export class GetDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(query: GetDriverQuery): Promise<Driver | null> {
    return this.driverRepository.findById(query.id);
  }
}
