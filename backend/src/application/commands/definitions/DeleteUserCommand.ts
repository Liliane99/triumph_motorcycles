import { Command } from "@nestjs-architects/typed-cqrs";

export class DeleteUserCommand extends Command<void> {
  constructor(public readonly id: string, public readonly deletedBy: string) {
    super();
  }
}
