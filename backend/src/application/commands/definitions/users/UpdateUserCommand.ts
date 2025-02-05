import { Command } from "@nestjs-architects/typed-cqrs";

export class UpdateUserCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly username?: string,
    public readonly email?: string,
    public readonly role?: "manager" | "client" | "admin",
    public readonly phoneNumber?: string,
    public readonly licenseNumber?: string,
    public readonly experienceLevel?: string
  ) {
    super();
  }
}
