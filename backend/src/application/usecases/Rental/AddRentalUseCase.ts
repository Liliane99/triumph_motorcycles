import { RentalRepository } from "../../ports/repositories/Rentalrepository";
import { IUserRepository } from "../../ports/repositories/UserRepository";
import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { CreateRentalCommand } from "../../commands/definitions/Rental/AddRentalCommand";
import { Rental } from "../../../domain/entities/Rental";

export class AddRentalUseCase {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly userRepository: IUserRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(command: CreateRentalCommand): Promise<Rental> {
    const { reference, price, rentalDate, clientId, motorcycleId } = command;

    
    const client = await this.userRepository.getUserById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    
    const rental = new Rental(
      `${Math.random()}`,
      reference,
      price,
      rentalDate,
      client,
      motorcycle
    );

    return this.rentalRepository.save(rental);
  }
}
