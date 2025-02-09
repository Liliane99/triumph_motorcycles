import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { IMaintenanceRepository } from "../../../../application/ports/repositories/MaintenanceRepository";

@Injectable()
export class MaintenancesAccessGuard implements CanActivate {
  constructor(@Inject("IMaintenanceRepository") private readonly maintenanceRepository: IMaintenanceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    return ["admin", "manager"].includes(user.role);
  }
}
