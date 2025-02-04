import { CreateMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/AddMotorcycleHandler';
import { UpdateMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/UpdateMotorcycleHandler';
import { DeleteMotorcycleHandler } from '../../../../application/commands/handlers/Motorcycle/DeleteMotorcycleHandler';
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';
import { CreateMotorcycleUseCase } from '../../../../application/usecases/Motorcycle/AddMotorcycleUseCase';
import { DeleteMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/DeleteMotorcycleUseCase";
import { UpdateMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/UpdateMotorcycleUseCase";

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
  }

  async execute(command: any): Promise<any> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for command ${command.constructor.name}`);
    }
    return handler.execute(command);
  }
}
