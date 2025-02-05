import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IOrderRepository } from "../../../../application/ports/repositories/OrderRepository";

@Injectable()
export class OrdersAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject("IOrderRepository") private readonly orderRepository: IOrderRepository
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
      throw new ForbiddenException("Vous n'êtes pas autorisé à manipuler les commandes.");
    }

    if (["updateOrder", "deleteOrder", "getOrderById"].includes(route) && targetId) {
      targetExists = await this.orderRepository.getOrderById(targetId) !== null;
      if (!targetExists) {
        throw new ForbiddenException("La commande cible n'existe pas.");
      }
    }

    return true;
  }
}
