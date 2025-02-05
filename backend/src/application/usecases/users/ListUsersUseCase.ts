import { IUserRepository } from "../../ports/repositories/UserRepository";

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(roleFilter: string[]) {
    const allUsers = await this.userRepository.listUsers();
    if (roleFilter.length === 0) {
      return allUsers;
    }
    return allUsers.filter(user => roleFilter.includes(user.role.value));
  }
}
