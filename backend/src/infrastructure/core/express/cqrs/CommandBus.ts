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
import { PrismaUserRepository } from '../../nest/adapters/repositories/PrismaUserRepository';
import { PrismaService } from "../../../database/prisma/PrismaService"; 

export class CommandBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const motorcycleRepository = new MotorcycleRepositoryImpl(); 
    const createMotorcycleUseCase = new CreateMotorcycleUseCase(motorcycleRepository);
    const deleteMotorcycleUseCase = new DeleteMotorcycleUseCase(motorcycleRepository);
    const updateMotorcycleUseCase = new UpdateMotorcycleUseCase(motorcycleRepository);

    this.handlers.set("CreateMotorcycleCommand", new CreateMotorcycleHandler(createMotorcycleUseCase));
    this.handlers.set('UpdateMotorcycleCommand', new UpdateMotorcycleHandler(updateMotorcycleUseCase));
    this.handlers.set("DeleteMotorcycleCommand", new DeleteMotorcycleHandler(deleteMotorcycleUseCase));

    
    const prismaService = new PrismaService(); 
    const rentalRepository = new RentalRepositoryImpl(); 
    const userRepository = new PrismaUserRepository(prismaService); 

    
    const createRentalUseCase = new AddRentalUseCase(rentalRepository, userRepository, motorcycleRepository);
    const deleteRentalUseCase = new DeleteRentalUseCase(rentalRepository);
    const updateRentalUseCase = new UpdateRentalUseCase(rentalRepository);

    
    this.handlers.set("CreateRentalCommand", new AddRentalHandler(createRentalUseCase));
    this.handlers.set('UpdateRentalCommand', new UpdateRentalHandler(updateRentalUseCase));
    this.handlers.set("DeleteRentalCommand", new DeleteRentalHandler(deleteRentalUseCase));
  }

  async execute(command: any): Promise<any> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for command ${command.constructor.name}`);
    }
    return handler.execute(command);
  }
}
