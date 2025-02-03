import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IUserRepository } from "../../../../../application/ports/repositories/UserRepository";
import { User } from "../../../../../domain/entities/User";
import { User as PrismaUser } from "@prisma/client";
import { Username } from "../../../../../domain/values/users/Username";
import { Email } from "../../../../../domain/values/users/Email";
import { Password } from "../../../../../domain/values/users/Password";
import { Role } from "../../../../../domain/values/users/Role";
import { PhoneNumber } from "../../../../../domain/values/users/PhoneNumber";
import { LicenseNumber } from "../../../../../domain/values/users/LicenseNumber";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        user_id: user.id,
        user_name: user.username.value,
        email: user.email.value,
        password: user.password.hashed, 
        role: user.role.value,
        phone_number: user.phoneNumber?.value ?? null,
        license_number: user.licenseNumber?.value ?? null,
        experience_level: user.experienceLevel ?? null,
        created_by: user.createdBy,
        updated_by: user.updatedBy,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });

    return this.mapToDomain(createdUser);
  }

  async updateUser(user: User): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: { user_id: user.id },
      data: {
        user_name: user.username.value,
        email: user.email.value,
        role: user.role.value,
        phone_number: user.phoneNumber?.value ?? null,
        license_number: user.licenseNumber?.value ?? null,
        experience_level: user.experienceLevel ?? null,
        updated_by: user.updatedBy,
        updated_at: new Date(),
      },
    });

    return updatedUser ? this.mapToDomain(updatedUser) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async listUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.mapToDomain(user));
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { user_id: id } });
  }


  async getUserRoleById(id: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: { role: true },
    });

    return user ? user.role : null;
  }

  private mapToDomain(user: PrismaUser): User {
    return new User(
      user.user_id,
      Username.from(user.user_name) as Username,
      Email.from(user.email) as Email,
      Password.fromHash(user.password) as Password, 
      Role.from(user.role) as Role,
      user.created_by ?? "",
      user.updated_by ?? "",
      new Date(user.created_at),
      new Date(user.updated_at),
      user.phone_number ? PhoneNumber.from(user.phone_number) as PhoneNumber : undefined,
      user.license_number ? LicenseNumber.from(user.license_number) as LicenseNumber : undefined,
      user.experience_level ?? undefined
    );
  }
}
