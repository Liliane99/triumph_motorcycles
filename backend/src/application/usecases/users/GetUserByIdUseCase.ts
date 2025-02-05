import { IUserRepository } from "../../ports/repositories/UserRepository";
import { GetUserByIdQuery } from "../../queries/definitions/users/GetUserByIdQuery";
import { UserNotFoundError } from "../../../domain/errors/users/UserNotFoundError";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserByIdQuery) {
    const user = await this.userRepository.getUserById(query.id);
    if (!user) {
      throw new UserNotFoundError(query.id);
    }
    return user;
  }
}
