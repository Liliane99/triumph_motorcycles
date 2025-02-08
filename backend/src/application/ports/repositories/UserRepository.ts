import { User } from "../../../domain/entities/User";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  listUsers(): Promise<User[]>;
  getUserRoleById(id: string): Promise<string | null>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
}
