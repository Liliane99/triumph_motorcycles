import { GetMotorcycleHandler } from "../../../../application/queries/handlers/GetMotorcycleHandler";
import { GetAllMotorcyclesHandler } from "../../../../application/queries/handlers/GetAllMotorcyclesHandler";
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';
import { GetMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/GetMotorcycleUseCase";
import { GetAllMotorcyclesUseCase } from "../../../../application/usecases/Motorcycle/GetAllMotorcyclesUseCase";

export class QueryBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const motorcycleRepository = new MotorcycleRepositoryImpl(); 
    const getMotorcycleUseCase = new GetMotorcycleUseCase(motorcycleRepository);
    const getAllMotorcyclesUseCase = new GetAllMotorcyclesUseCase(motorcycleRepository);

    this.handlers.set("GetMotorcycleQuery", new GetMotorcycleHandler(getMotorcycleUseCase));
    this.handlers.set("GetAllMotorcyclesQuery", new GetAllMotorcyclesHandler(getAllMotorcyclesUseCase));
  }

  async execute(query: any): Promise<any> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for query ${query.constructor.name}`);
    }
    return handler.execute(query);
  }
}
