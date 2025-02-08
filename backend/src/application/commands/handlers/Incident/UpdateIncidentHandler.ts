import { CommandHandler } from "@nestjs/cqrs";
import { UpdateIncidentCommand } from '../../definitions/Incident/UpdateIncidentCommand'; 
import { UpdateIncidentUseCase } from '../../../usecases/Incident/UpdateIncidentUseCase'; 

@CommandHandler(UpdateIncidentCommand)
export class UpdateIncidentHandler {
  constructor(private readonly useCase: UpdateIncidentUseCase) {}

  async execute(command: UpdateIncidentCommand) {
    return this.useCase.execute(command);
  }
}
