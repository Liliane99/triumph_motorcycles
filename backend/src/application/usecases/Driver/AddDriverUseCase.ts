import { DriverRepository } from "../../ports/repositories/DriverRepository";
import { IUserRepository } from "../../ports/repositories/UserRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateDriverCommand } from "../../commands/definitions/Driver/AddDriverCommand";
import { Driver } from "../../../domain/entities/Driver";

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

    const driver = new Driver(
      `${Math.random()}`,
      licenseNumber,
      experienceLevel,
      dateOfBirth,
      client,
      motorcycle,
    );

    return this.driverRepository.save(driver);
  }
}
