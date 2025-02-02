import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserController } from "./UserController";
import { PrismaUserRepository } from "../../../../adapters/repositories/PrismaUserRepository";
import { MongoEventRepository } from "../../../../adapters/repositories/MongoEventRepository";
import { BcryptPasswordService } from "../../../../adapters/services/BcryptPasswordService";
import { JWTAuthenticationService } from "../../../../adapters/services/JWTAuthenticationService";
import { PrismaService } from "../../../../database/prisma/PrismaService";

// ✅ Import des ports (interfaces)
import { IUserRepository } from "../../../../../application/ports/repositories/UserRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { IPasswordService, ITokenService } from "../../../../../application/ports/services/AuthenticationService"; // ✅ Ajouté ici !

// ✅ Use Cases
import { CreateUserUseCase } from "../../../../../application/usecases/users/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../../../application/usecases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../../../application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../../../../application/usecases/users/GetUserByIdUseCase";
import { ListUsersUseCase } from "../../../../../application/usecases/users/ListUsersUseCase";
import { LoginUserUseCase } from "../../../../../application/usecases/users/LoginUserUseCase";

// ✅ Command Handlers
import { CreateUserCommandHandler } from "../../../../../application/commands/handlers/CreateUserCommandHandler";
import { UpdateUserCommandHandler } from "../../../../../application/commands/handlers/UpdateUserCommandHandler";
import { DeleteUserCommandHandler } from "../../../../../application/commands/handlers/DeleteUserCommandHandler";
import { LoginUserCommandHandler } from "../../../../../application/commands/handlers/LoginUserCommandHandler";


// ✅ Query Handlers
import { GetUserByIdQueryHandler } from "../../../../../application/queries/handlers/GetUserByIdQueryHandler";
import { ListUsersQueryHandler } from "../../../../../application/queries/handlers/ListUsersQueryHandler";

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    PrismaService,

    // ✅ Liaison des interfaces aux implémentations
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
      useClass: BcryptPasswordService, // ✅ Correction ici
    },
    {
      provide: "ITokenService",
      useClass: JWTAuthenticationService, // ✅ Correction ici
    },

    // ✅ Injection manuelle des Use Cases (découplés de NestJS)
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        eventStore: IEventPublisherService,
        passwordService: IPasswordService // ✅ Ajout du service de hashage
      ) => new CreateUserUseCase(userRepository, eventStore, passwordService), // ✅ Correction ici
      inject: ["IUserRepository", "IEventPublisherService", "IPasswordService"], // ✅ Correction ici
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
      inject: ["IUserRepository", "IPasswordService", "ITokenService"], // ✅ Ajouté ici
    },

    // ✅ Command Handlers
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    LoginUserCommandHandler,

    // ✅ Query Handlers
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
