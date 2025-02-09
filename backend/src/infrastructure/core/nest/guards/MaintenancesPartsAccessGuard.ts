import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IMaintenanceRepository } from "../../../../application/ports/repositories/MaintenanceRepository";
import { IPartRepository } from "../../../../application/ports/repositories/PartRepository";

@Injectable()
export class MaintenancesPartsAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IMaintenanceRepository") private readonly maintenanceRepository: IMaintenanceRepository,
    @Inject("IPartRepository") private readonly partRepository: IPartRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}
