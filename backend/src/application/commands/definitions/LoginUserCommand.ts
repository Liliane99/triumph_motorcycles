import { Command } from "@nestjs-architects/typed-cqrs";

export class LoginUserCommand extends Command<string> {
  constructor(public readonly email: string, public readonly password: string) {
    super();
  }
}
