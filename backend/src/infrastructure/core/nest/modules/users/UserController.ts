import { 
  Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req, Res, HttpStatus 
} from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
import { RolesAccessGuard } from "../../guards/RolesAccessGuard"; 
import { v4 as uuidv4 } from "uuid";

// ✅ Import des Commandes et Queries
import { CreateUserCommand } from "../../../../../application/commands/definitions/CreateUserCommand";
import { UpdateUserCommand } from "../../../../../application/commands/definitions/UpdateUserCommand";
//import { DeleteUserCommand } from "../../../../../application/commands/definitions/DeleteUserCommand";
import { GetUserByIdQuery } from "../../../../../application/queries/definitions/GetUserByIdQuery";
import { ListUsersQuery } from "../../../../../application/queries/definitions/ListUsersQuery";
import { LoginUserCommand } from "../../../../../application/commands/definitions/LoginUserCommand";

// ✅ Import des DTOs
import { CreateUserDto } from "../../dto/CreateUserDto";
import { UpdateUserDto } from "../../dto/UpdateUserDto";
import { LoginUserDto } from "../../dto/LoginUserDto";

// ✅ Import des Erreurs
import { EmailAlreadyExistsError } from "../../../../../domain/errors/users/EmailAlreadyExistsError";
import { UserNotFoundError } from "../../../../../domain/errors/users/UserNotFoundError";
import { InvalidCredentialsError } from "../../../../../domain/errors/users/InvalidCredentialsError";

@Controller("users")
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * ✅ Connexion d'un utilisateur
   */
  @Post("login")
  async login(@Res() res: Response, @Body() body: LoginUserDto) {
    try {
      const token = await this.commandBus.execute(new LoginUserCommand(body.email, body.password));
      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  /**
   * ✅ Création d'un utilisateur (⚠️ PROTÉGÉ)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesAccessGuard)
  async createUser(@Req() req: Request, @Res() res: Response, @Body() body: CreateUserDto) {
    try {
      const id = uuidv4();
      const createdBy = req.user?.userId ?? "system";

      await this.commandBus.execute(
        new CreateUserCommand(
          id, body.username, body.email, body.password, 
          body.role as "manager" | "client" | "admin",
          createdBy, body.phoneNumber, body.licenseNumber, body.experienceLevel
        )
      );

      return res.status(HttpStatus.CREATED).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  /**
   * ✅ Mise à jour d'un utilisateur (⚠️ PROTÉGÉ)
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesAccessGuard)
  async updateUser(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: UpdateUserDto) {
    try {
      const updatedBy = req.user?.userId ?? "system";

      await this.commandBus.execute(
        new UpdateUserCommand(id, updatedBy, body.username, body.email, body.role)
      );

      return res.status(HttpStatus.OK).json({ message: "Utilisateur mis à jour avec succès !" });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  /**
   * ✅ Suppression d'un utilisateur (⚠️ PROTÉGÉ)
   */
  // @Delete(":id")
  // @UseGuards(JwtAuthGuard, RolesAccessGuard)
  // async deleteUser(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
  //   try {
  //     await this.commandBus.execute(new DeleteUserCommand(id));
  //     return res.status(HttpStatus.NO_CONTENT).send();
  //   } catch (error) {
  //     if (error instanceof UserNotFoundError) {
  //       return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
  //     }
  //     return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
  //   }
  // }

  /**
   * ✅ Récupération de la liste des utilisateurs (⚠️ PROTÉGÉ)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesAccessGuard)
  async listUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const roleFilter = req.query.roleFilter as string[] || []; 
      const users = await this.queryBus.execute(new ListUsersQuery(roleFilter));
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  /**
   * ✅ Récupération d'un utilisateur par ID (⚠️ PROTÉGÉ)
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesAccessGuard)
  async getUserById(@Res() res: Response, @Param("id") id: string) {
    try {
      const user = await this.queryBus.execute(new GetUserByIdQuery(id));
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }
}
