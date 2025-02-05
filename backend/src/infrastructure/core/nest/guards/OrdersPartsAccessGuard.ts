import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IOrderRepository } from "../../../../application/ports/repositories/OrderRepository";
import { IPartRepository } from "../../../../application/ports/repositories/PartRepository";

@Injectable()
export class OrdersPartsAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IOrderRepository") private readonly orderRepository: IOrderRepository,
    @Inject("IPartRepository") private readonly partRepository: IPartRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const route = context.getHandler().name;
    const { orderId, partId } = request.params;

    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    const isAuthorized = ["admin", "manager"].includes(user.role);
    if (!isAuthorized) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à gérer les pièces des commandes.");
    }

    if (["addPartToOrder", "updatePartInOrder", "removePartFromOrder", "getOrderParts"].includes(route) && orderId && partId) {
      const orderExists = await this.orderRepository.getOrderById(orderId) !== null;
      const partExists = await this.partRepository.getPartById(partId) !== null;

      if (!orderExists) {
        throw new ForbiddenException("La commande cible n'existe pas.");
      }

      if (!partExists) {
        throw new ForbiddenException("La pièce cible n'existe pas.");
      }
    }

    return true;
  }
}
