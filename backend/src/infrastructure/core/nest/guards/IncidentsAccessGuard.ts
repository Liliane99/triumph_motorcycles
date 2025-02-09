import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IIncidentRepository } from "../../../../application/ports/repositories/IncidentRepository";

@Injectable()
export class IncidentsAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IIncidentRepository") private readonly incidentRepository: IIncidentRepository
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
      throw new ForbiddenException("Vous n'êtes pas autorisé à manipuler les incidents.");
    }

    if (["updateIncident", "deleteIncident", "getIncidentById"].includes(route) && targetId) {
      targetExists = await this.incidentRepository.getIncidentById(targetId) !== null;
      if (!targetExists) {
        throw new ForbiddenException("L'incident cible n'existe pas.");
      }
    }

    return true;
  }
}
