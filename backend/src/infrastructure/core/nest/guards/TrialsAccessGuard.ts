import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ITrialRepository } from "../../../../application/ports/repositories/TrialRepository";

@Injectable()
export class TrialsAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("ITrialRepository") private readonly trialRepository: ITrialRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user; 
    const route = context.getHandler().name; 
    const { userId, motorcycleId } = request.params; 

    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    if (["admin", "manager"].includes(user.role)) {
      return true;
    }

    if (user.role === "client") {
      if (!userId || userId !== user.userId) {
        throw new ForbiddenException("Vous n'êtes pas autorisé à voir cet essai.");
      }

      const userTrials = await this.trialRepository.getTrialsByUserId(user.userId);
      const trialExists = userTrials.some(trial => trial.motorcycleId === motorcycleId);

      if (!trialExists) {
        throw new ForbiddenException("Vous n'avez pas accès à cet essai.");
      }

      return true;
    }

    throw new ForbiddenException("Accès refusé.");
  }
}
