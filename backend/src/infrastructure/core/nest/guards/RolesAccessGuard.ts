import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IUserRepository } from "../../../../application/ports/repositories/UserRepository";

@Injectable()
export class RolesAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IUserRepository") private readonly userRepository: IUserRepository 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user; 
    const route = context.getHandler().name; 
    const targetId = request.params.id; 
    let targetRole: string | null = null;

    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    if (["updateUser", "deleteUser", "getUserById"].includes(route) && targetId) {
      targetRole = await this.userRepository.getUserRoleById(targetId);
      if (!targetRole) {
        throw new ForbiddenException("L'utilisateur cible n'existe pas.");
      }
    }

    const rules = {
      createUser: (userRole: string, bodyRole: string) =>
        userRole === "admin" || (userRole === "manager" && bodyRole !== "admin"),

      updateUser: (userRole: string, targetRole: string, userId: string, targetId: string) =>
        userRole === "admin" ||
        (userRole === "manager" && targetRole !== "admin") ||
        (userRole === "client" && userId === targetId),

      deleteUser: (userRole: string, targetRole: string) =>
        userRole === "admin" || (userRole === "manager" && targetRole !== "admin"),

      listUsers: (userRole: string) =>
        userRole === "admin" || userRole === "manager",

      getUserById: (userRole: string, targetRole: string, userId: string, targetId: string) =>
        userRole === "admin" ||
        (userRole === "manager" && targetRole !== "admin") ||
        (userRole === "client" && userId === targetId),
    };

    switch (route) {
      case "createUser":
        if (!rules.createUser(user.role, request.body.role)) {
          throw new ForbiddenException("Vous n'êtes pas autorisé à créer cet utilisateur.");
        }
        break;

      case "updateUser":
      case "deleteUser":
        if (!targetRole || !rules.updateUser(user.role, targetRole, user.userId, targetId)) {
          throw new ForbiddenException("Vous n'êtes pas autorisé à modifier/supprimer cet utilisateur.");
        }
        break;

      case "listUsers":
        if (!rules.listUsers(user.role)) {
          throw new ForbiddenException("Vous n'êtes pas autorisé à voir la liste des utilisateurs.");
        }
        request.query.roleFilter = user.role === "manager" ? ["manager", "client"] : [];
        break;

      case "getUserById":
        if (!targetRole || !rules.getUserById(user.role, targetRole, user.userId, targetId)) {
          throw new ForbiddenException("Vous n'êtes pas autorisé à voir cet utilisateur.");
        }
        break;
    }

    return true;
  }
}