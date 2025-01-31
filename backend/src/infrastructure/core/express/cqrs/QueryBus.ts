import { GetMotorcycleHandler } from '../../../../application/queries/handlers/GetMotorcycleHandler';
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';
import { GetAllMotorcyclesHandler } from '../../../../application/queries/handlers/GetMotorcycleHandler';

export class QueryBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const motorcycleRepository = new MotorcycleRepositoryImpl(); 

    this.handlers.set('GetMotorcycleQuery', new GetMotorcycleHandler(motorcycleRepository));
    this.handlers.set('GetAllMotorcyclesQuery', new GetAllMotorcyclesHandler(motorcycleRepository));
  }

  async execute(query: any): Promise<any> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for query ${query.constructor.name}`);
    }
    return handler.execute(query);
  }
}
