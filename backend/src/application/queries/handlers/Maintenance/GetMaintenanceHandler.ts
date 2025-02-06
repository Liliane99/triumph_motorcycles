import { GetMaintenanceQuery } from "../../definitions/Maintenance/GetMaintenanceQuery"; 
import { GetMaintenanceUseCase } from "../../../usecases/Maintenance/GetMaintenanceUseCase";

export class GetAllMaintenanceHandler {
  constructor(private readonly useCase: GetMaintenanceUseCase) {}

  async execute(query: GetMaintenanceQuery) {
    return this.useCase.execute(query);
  }
}