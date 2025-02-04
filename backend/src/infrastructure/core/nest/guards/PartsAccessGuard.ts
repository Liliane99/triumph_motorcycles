import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IPartRepository } from "../../../../application/ports/repositories/PartRepository";

@Injectable()
export class PartsAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IPartRepository") private readonly partRepository: IPartRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user; 
    const route = context.getHandler().name; 
    const targetId = request.params.id; 
    let targetExists: boolean = false;

    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    const isAuthorized = ["admin", "manager"].includes(user.role);
    if (!isAuthorized) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à manipuler les pièces.");
    }

    if (["updatePart", "deletePart", "getPartById"].includes(route) && targetId) {
      targetExists = await this.partRepository.getPartById(targetId) !== null;
      if (!targetExists) {
        throw new ForbiddenException("La pièce cible n'existe pas.");
      }
    }

    return true;
  }
}
