import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { GetAllDriverQuery } from "../../queries/definitions/Driver/GetDriverQuery";
import { Driver } from "../../../domain/entities/Driver";

export class GetAllDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(query: GetAllDriverQuery): Promise<Driver[]> {
    return this.driverRepository.getAll();
  }
}