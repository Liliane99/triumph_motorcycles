import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateUserPasswordCommand extends Command<void> {
  constructor(
    public readonly id: string, 
    public readonly oldPassword: string, 
    public readonly newPassword: string, 
    public readonly updatedBy: string
  ) {
    super();
  }
}
