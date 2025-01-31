import { CreateMotorcycleHandler } from "../../../../application/commands/handlers/AddMotorcycleHandler";
import { GetMotorcycleHandler } from "../../../../application/queries/handlers/GetMotorcycleHandler";
import { MotorcycleRepository } from "../../../adapters/repositories/MotorcycleRepository";
import { CreateMotorcycleCommand } from "../../../../application/commands/definitions/AddMotorcycleCommand";

export class MotorcycleService {
  private repository = new MotorcycleRepository();
  private createHandler = new CreateMotorcycleHandler(this.repository);
  private getHandler = new GetMotorcycleHandler(this.repository);

  async createMotorcycle(command: CreateMotorcycleCommand) {
    return await this.createHandler.execute(command);
  }

  /*async getAllMotorcycles() {
    return await this.repository.getAll();
  }

  async getMotorcycleById(id: number) {
    return await this.getHandler.execute({ id });
  }*/
}
