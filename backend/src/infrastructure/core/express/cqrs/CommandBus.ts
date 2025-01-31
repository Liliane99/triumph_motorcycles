import { CreateMotorcycleHandler } from '../../../../application/commands/handlers/AddMotorcycleHandler';
import { UpdateMotorcycleHandler } from '../../../../application/commands/handlers/UpdateMotorcycleHandler';
import { DeleteMotorcycleHandler } from '../../../../application/commands/handlers/DeleteMotorcycleHandler';
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';

export class CommandBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const motorcycleRepository = new MotorcycleRepositoryImpl(); 

    this.handlers.set('CreateMotorcycleCommand', new CreateMotorcycleHandler(motorcycleRepository));
    this.handlers.set('UpdateMotorcycleCommand', new UpdateMotorcycleHandler(motorcycleRepository));
    this.handlers.set('DeleteMotorcycleCommand', new DeleteMotorcycleHandler(motorcycleRepository));
  }

  async execute(command: any): Promise<any> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for command ${command.constructor.name}`);
    }
    return handler.execute(command);
  }
}
