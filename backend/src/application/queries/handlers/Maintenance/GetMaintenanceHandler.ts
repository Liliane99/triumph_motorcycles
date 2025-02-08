import { QueryHandler } from "@nestjs/cqrs";
import { GetMaintenanceQuery } from "../../definitions/Maintenance/GetMaintenanceQuery"; 
import { GetMaintenanceUseCase } from "../../../usecases/Maintenance/GetMaintenanceUseCase";

@QueryHandler(GetMaintenanceQuery)
export class GetMaintenanceHandler {
  constructor(private readonly useCase: GetMaintenanceUseCase) {}

  async execute(query: GetMaintenanceQuery) {
    return this.useCase.execute(query);
  }
}