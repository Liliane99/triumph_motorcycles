import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { UpdateDriverCommand } from "../../commands/definitions/Driver/UpdateDriverCommand";
import { Driver } from "../../../domain/entities/Driver";

export class UpdateDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(command: UpdateDriverCommand): Promise<Driver> {
    const driver = await this.driverRepository.findById(command.id);
    if (!driver) {
      throw new Error("Driver not found");
    }

    if (command.licenseNumber) driver.updateLicenseNumber(command.licenseNumber);
    if (command.experienceLevel) driver.updateExperienceLevel(command.experienceLevel);

    return this.driverRepository.save(driver);
  }
}
