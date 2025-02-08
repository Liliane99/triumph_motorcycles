import { CreateMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/AddMotorcycleHandler';
import { UpdateMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/UpdateMotorcycleHandler';
import { DeleteMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/DeleteMotorcycleHandler';
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';
import { CreateMotorcycleUseCase } from '../../../../application/usecases/Motorcycle/AddMotorcycleUseCase';
import { DeleteMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/DeleteMotorcycleUseCase";
import { UpdateMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/UpdateMotorcycleUseCase";

import { AddRentalHandler } from '../../../../application/commands/handlers/Rental/AddRentalHandler';
import { UpdateRentalHandler } from '../../../../application/commands/handlers/Rental/UpdateRentalHandler';
import { DeleteRentalHandler } from '../../../../application/commands/handlers/Rental/DeleteRentalHandler';
import { RentalRepositoryImpl } from '../repositories/RentalRepositoryImpl';
import { AddRentalUseCase } from '../../../../application/usecases/Rental/AddRentalUseCase';
import { DeleteRentalUseCase } from "../../../../application/usecases/Rental/DeleteRentalUseCase";
import { UpdateRentalUseCase } from "../../../../application/usecases/Rental/UpdateRentalUseCase";

import { AddDriverHandler } from '../../../../application/commands/handlers/Driver/AddDriverHandler';
import { UpdateDriverHandler } from '../../../../application/commands/handlers/Driver/UpdateDriverHandler';
import { DeleteDriverHandler } from '../../../../application/commands/handlers/Driver/DeleteDriverHandler';
import { DriverRepositoryImpl } from '../repositories/DriverRepositoryImpl';
import { AddDriverUseCase } from '../../../../application/usecases/Driver/AddDriverUseCase';
import { DeleteDriverUseCase } from "../../../../application/usecases/Driver/DeleteDriverUseCase";
import { UpdateDriverUseCase } from "../../../../application/usecases/Driver/UpdateDriverUseCase";

import { PrismaUserRepository } from '../../nest/adapters/repositories/PrismaUserRepository';
import { PrismaService } from "../../../database/prisma/PrismaService"; 
import { BrevoEmailService } from '../../nest/adapters/services/BrevoEmailService';

export class CommandBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const prismaService = new PrismaService(); 
    const motorcycleRepository = new MotorcycleRepositoryImpl(); 
    const emailService = new BrevoEmailService();

    const userRepository = new PrismaUserRepository(prismaService);
    const rentalRepository = new RentalRepositoryImpl(); 
    const driverRepository = new DriverRepositoryImpl(); 

    // Use Cases pour Motorcycle
    const createMotorcycleUseCase = new CreateMotorcycleUseCase(motorcycleRepository, emailService);
    const deleteMotorcycleUseCase = new DeleteMotorcycleUseCase(motorcycleRepository);
    
    
    const updateMotorcycleUseCase = new UpdateMotorcycleUseCase(motorcycleRepository, emailService, userRepository);

    this.handlers.set("CreateMotorcycleCommand", new CreateMotorcycleHandler(createMotorcycleUseCase));
    this.handlers.set("UpdateMotorcycleCommand", new UpdateMotorcycleHandler(updateMotorcycleUseCase));
    this.handlers.set("DeleteMotorcycleCommand", new DeleteMotorcycleHandler(deleteMotorcycleUseCase));

    // Use Cases pour Rental
    const createRentalUseCase = new AddRentalUseCase(rentalRepository, userRepository, motorcycleRepository);
    const deleteRentalUseCase = new DeleteRentalUseCase(rentalRepository);
    const updateRentalUseCase = new UpdateRentalUseCase(rentalRepository);

    this.handlers.set("CreateRentalCommand", new AddRentalHandler(createRentalUseCase));
    this.handlers.set("UpdateRentalCommand", new UpdateRentalHandler(updateRentalUseCase));
    this.handlers.set("DeleteRentalCommand", new DeleteRentalHandler(deleteRentalUseCase));

    // Use Cases pour Driver
    const createDriverUseCase = new AddDriverUseCase(driverRepository, userRepository,  motorcycleRepository);
    const deleteDriverUseCase = new DeleteDriverUseCase(driverRepository);
    const updateDriverUseCase = new UpdateDriverUseCase(driverRepository);

    this.handlers.set("CreateDriverCommand", new AddDriverHandler(createDriverUseCase));
    this.handlers.set("UpdateDriverCommand", new UpdateDriverHandler(updateDriverUseCase));
    this.handlers.set("DeleteDriverCommand", new DeleteDriverHandler(deleteDriverUseCase));
}


  async execute(command: any): Promise<any> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for command ${command.constructor.name}`);
    }
    return handler.execute(command);
  }
}