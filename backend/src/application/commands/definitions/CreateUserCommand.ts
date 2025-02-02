import { Command } from "@nestjs-architects/typed-cqrs";

export class CreateUserCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: "manager" | "client" | "admin",
    public readonly createdBy: string,
    public readonly phoneNumber?: string,
    public readonly licenseNumber?: string,
    public readonly experienceLevel?: string
  ) {
    super();
  }
}
