import { CommandHandler } from "@nestjs/cqrs";
import { DeleteIncidentCommand } from '../../definitions/Incident/DeleteIncidentCommand'; 
import { DeleteIncidentUseCase } from '../../../usecases/Incident/DeleteIncidentUseCase'; 

@CommandHandler(DeleteIncidentCommand)
export class DeleteIncidentHandler {
  constructor(private readonly useCase: DeleteIncidentUseCase) {}

  async execute(command: DeleteIncidentCommand) {
    return this.useCase.execute(command.id);
  }
}
