import { GetMotorcycleHandler } from "../../../../application/queries/handlers/Motorcycle/GetMotorcycleHandler";
import { GetAllMotorcyclesHandler } from "../../../../application/queries/handlers/Motorcycle/GetAllMotorcyclesHandler";
import { GetMotorcycleUseCase } from "../../../../application/usecases/Motorcycle/GetMotorcycleUseCase";
import { GetAllMotorcyclesUseCase } from "../../../../application/usecases/Motorcycle/GetAllMotorcyclesUseCase";
import { MotorcycleRepositoryImpl } from '../repositories/MotorcycleRepository';

import { GetRentalHandler } from "../../../../application/queries/handlers/Rental/GetRentalHandler";
import { GetAllRentalsHandler } from "../../../../application/queries/handlers/Rental/GetAllRentalsHandler";
import { GetRentalUseCase } from "../../../../application/usecases/Rental/GetRentalUseCase";
import { GetAllRentalsUseCase } from "../../../../application/usecases/Rental/GetAllRentalsUseCase";
import { RentalRepositoryImpl } from '../repositories/RentalRepositoryImpl';

import { GetDriverHandler } from "../../../../application/queries/handlers/Driver/GetDriverHandler";
import { GetAllDriversHandler } from "../../../../application/queries/handlers/Driver/GetAllDriversHandler";
import { GetDriverUseCase } from "../../../../application/usecases/Driver/GetDriverUseCase";
import { GetAllDriversUseCase } from "../../../../application/usecases/Driver/GetAllDriversUseCase";
import { DriverRepositoryImpl } from '../repositories/DriverRepositoryImpl';

export class QueryBus {
  private handlers: Map<string, any> = new Map();

  constructor() {
    const driverRepository = new DriverRepositoryImpl();
    const getDriverUseCase = new GetDriverUseCase(driverRepository);
    const getAllDriversUseCase = new GetAllDriversUseCase(driverRepository);

    this.handlers.set("GetDriverQuery", new GetDriverHandler(getDriverUseCase));
    this.handlers.set("GetAllDriverQuery", new GetAllDriversHandler(getAllDriversUseCase));

    const motorcycleRepository = new MotorcycleRepositoryImpl();
    const getMotorcycleUseCase = new GetMotorcycleUseCase(motorcycleRepository);
    const getAllMotorcyclesUseCase = new GetAllMotorcyclesUseCase(motorcycleRepository);

    this.handlers.set("GetMotorcycleQuery", new GetMotorcycleHandler(getMotorcycleUseCase));
    this.handlers.set("GetAllMotorcyclesQuery", new GetAllMotorcyclesHandler(getAllMotorcyclesUseCase));

    const rentalRepository = new RentalRepositoryImpl();
    const getRentalUseCase = new GetRentalUseCase(rentalRepository);
    const getAllRentalsUseCase = new GetAllRentalsUseCase(rentalRepository);

    this.handlers.set("GetRentalQuery", new GetRentalHandler(getRentalUseCase));
    this.handlers.set("GetAllRentalQuery", new GetAllRentalsHandler(getAllRentalsUseCase));
  }

  async execute(query: any): Promise<any> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for query ${query.constructor.name}`);
    }
    return handler.execute(query);
  }
}
