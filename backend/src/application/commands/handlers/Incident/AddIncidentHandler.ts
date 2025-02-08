import { CommandHandler } from "@nestjs/cqrs";
import { CreateIncidentCommand } from '../../definitions/Incident/AddIncidentCommand'; 
import { CreateIncidentUseCase } from '../../../usecases/Incident/AddIncidentUseCase';

@CommandHandler(CreateIncidentCommand)
export class CreateIncidentHandler {
  constructor(private readonly useCase: CreateIncidentUseCase) {}

  async execute(command: CreateIncidentCommand) {
    return await this.useCase.execute(command);
  }
}
