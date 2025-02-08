import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { IUserRepository } from "../../ports/repositories/UserRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateDriverCommand } from "../../commands/definitions/Driver/AddDriverCommand";
import { Driver } from "../../../domain/entities/Driver";
import { LicenseNumber } from "../../../domain/values/users/LicenseNumber";
import { InvalidLicenseNumberError } from "../../../domain/errors/users/InvalidLicenseNumberError";
import { DateOfBirth } from "../../../domain/values/Driver/DateOfBirth";
import { InvalidDateOfBirthError } from "../../../domain/errors/Driver/InvalidDateOfBirthError";

export class AddDriverUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly userRepository: IUserRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(command: CreateDriverCommand): Promise<Driver> {
    const { licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId } = command;

    const client = await this.userRepository.getUserById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    const validLicenseNumber = LicenseNumber.from(licenseNumber);
    if (validLicenseNumber instanceof InvalidLicenseNumberError) {
      throw validLicenseNumber;
    }

    const validDateOfBirth = DateOfBirth.from(dateOfBirth.toISOString());
    if (validDateOfBirth instanceof InvalidDateOfBirthError) {
      throw validDateOfBirth;
    }

    const driver = new Driver(
      `${Math.random()}`,
      validLicenseNumber,
      experienceLevel,
      validDateOfBirth,
      client,
      motorcycle
    );

    return this.driverRepository.save(driver);
  }
}
