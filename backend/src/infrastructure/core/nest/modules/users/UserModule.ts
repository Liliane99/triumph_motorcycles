import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserController } from "./UserController";
import { PrismaUserRepository } from "../../adapters/repositories/PrismaUserRepository";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { BcryptPasswordService } from "../../adapters/services/BcryptPasswordService";
import { JWTAuthenticationService } from "../../adapters/services/JWTAuthenticationService";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IUserRepository } from "../../../../../application/ports/repositories/UserRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { IPasswordService, ITokenService } from "../../../../../application/ports/services/AuthenticationService"; 
import { CreateUserUseCase } from "../../../../../application/usecases/users/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../../../application/usecases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../../../application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../../../../application/usecases/users/GetUserByIdUseCase";
import { ListUsersUseCase } from "../../../../../application/usecases/users/ListUsersUseCase";
import { LoginUserUseCase } from "../../../../../application/usecases/users/LoginUserUseCase";
import { UpdateUserPasswordUseCase } from "../../../../../application/usecases/users/UpdateUserPasswordUseCase";
import { CreateUserCommandHandler } from "../../../../../application/commands/handlers/users/CreateUserCommandHandler";
import { UpdateUserCommandHandler } from "../../../../../application/commands/handlers/users/UpdateUserCommandHandler";
import { DeleteUserCommandHandler } from "../../../../../application/commands/handlers/users/DeleteUserCommandHandler";
import { LoginUserCommandHandler } from "../../../../../application/commands/handlers/users/LoginUserCommandHandler";
import { UpdateUserPasswordCommandHandler } from "../../../../../application/commands/handlers/users/UpdateUserPasswordCommandHandler";
import { GetUserByIdQueryHandler } from "../../../../../application/queries/handlers/users/GetUserByIdQueryHandler";
import { ListUsersQueryHandler } from "../../../../../application/queries/handlers/users/ListUsersQueryHandler";

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: "IUserRepository",
      useClass: PrismaUserRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: "IPasswordService",
      useClass: BcryptPasswordService, 
    },
    {
      provide: "ITokenService",
      useClass: JWTAuthenticationService,
    },

    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        eventStore: IEventPublisherService,
        passwordService: IPasswordService 
      ) => new CreateUserUseCase(userRepository, eventStore, passwordService), 
      inject: ["IUserRepository", "IEventPublisherService", "IPasswordService"], 
    },    
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: IUserRepository, eventStore: IEventPublisherService) =>
        new UpdateUserUseCase(userRepository, eventStore),
      inject: ["IUserRepository", "IEventPublisherService"],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: IUserRepository, eventStore: IEventPublisherService) =>
        new DeleteUserUseCase(userRepository, eventStore),
      inject: ["IUserRepository", "IEventPublisherService"],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepository: IUserRepository) => new GetUserByIdUseCase(userRepository),
      inject: ["IUserRepository"],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: IUserRepository) => new ListUsersUseCase(userRepository),
      inject: ["IUserRepository"],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository: IUserRepository, passwordService: IPasswordService, tokenService: ITokenService) =>
        new LoginUserUseCase(userRepository, passwordService, tokenService),
      inject: ["IUserRepository", "IPasswordService", "ITokenService"], 
    },
    {
      provide: UpdateUserPasswordUseCase,
      useFactory: (
        userRepository: IUserRepository,
        passwordService: IPasswordService,
        eventStore: IEventPublisherService
      ) => new UpdateUserPasswordUseCase(userRepository, passwordService, eventStore),
      inject: ["IUserRepository", "IPasswordService", "IEventPublisherService"],
    },
    

    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    LoginUserCommandHandler,
    UpdateUserPasswordCommandHandler,
    GetUserByIdQueryHandler,
    ListUsersQueryHandler,
  ],
  exports: [
    "IUserRepository",
    "IEventPublisherService",
    "IPasswordService",
    "ITokenService",
  ],
})
export class UserModule {}
