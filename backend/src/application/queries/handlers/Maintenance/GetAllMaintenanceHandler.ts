import { GetAllMaintenanceQuery } from "../../definitions/Maintenance/GetMaintenanceQuery"; 
import { GetAllMaintenanceUseCase } from "../../../usecases/Maintenance/GetAllMaintenanceUseCase";

export class GetAllMaintenanceHandler {
  constructor(private readonly useCase: GetAllMaintenanceUseCase) {}

  async execute(query: GetAllMaintenanceQuery) {
    return this.useCase.execute(query);
  }
}