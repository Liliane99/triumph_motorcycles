import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IOrderPartRepository } from "../../../../../application/ports/repositories/OrderPartRepository";
import { OrderPart } from "../../../../../domain/entities/OrderPart";
import { OrderPart as PrismaOrderPart } from "@prisma/client";
import { QuantityOrdered } from "../../../../../domain/values/orders/QuantityOrdered";

@Injectable()
export class PrismaOrderPartRepository implements IOrderPartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addPartToOrder(orderPart: OrderPart): Promise<OrderPart> {
    const createdOrderPart = await this.prisma.orderPart.create({
      data: {
        order_id: orderPart.orderId,
        part_id: orderPart.partId,
        quantity_ordered: orderPart.quantityOrdered.value,
      },
    });

    return this.mapToDomain(createdOrderPart);
  }

  async updatePartInOrder(orderId: string, partId: string, quantityOrdered: number): Promise<OrderPart | null> {
    const updatedOrderPart = await this.prisma.orderPart.update({
      where: {
        order_id_part_id: {
          order_id: orderId,
          part_id: partId,
        },
      },
      data: {
        quantity_ordered: quantityOrdered,
      },
    });

    return updatedOrderPart ? this.mapToDomain(updatedOrderPart) : null;
  }

  async removePartFromOrder(orderId: string, partId: string): Promise<void> {
    await this.prisma.orderPart.delete({
      where: {
        order_id_part_id: {
          order_id: orderId,
          part_id: partId,
        },
      },
    });
  }

  async getOrderPart(orderId: string, partId: string): Promise<OrderPart | null> {
    const orderPart = await this.prisma.orderPart.findUnique({
      where: {
        order_id_part_id: {
          order_id: orderId,
          part_id: partId,
        },
      },
    });

    return orderPart ? this.mapToDomain(orderPart) : null;
  }

  async getPartsByOrderId(orderId: string): Promise<OrderPart[]> {
    const orderParts = await this.prisma.orderPart.findMany({
      where: { order_id: orderId },
    });

    return orderParts.map((orderPart) => this.mapToDomain(orderPart));
  }

  private mapToDomain(orderPart: PrismaOrderPart): OrderPart {
    const validQuantityOrdered = QuantityOrdered.from(orderPart.quantity_ordered);

    if (validQuantityOrdered instanceof Error) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers OrderPart");
    }

    return new OrderPart(orderPart.order_id, orderPart.part_id, validQuantityOrdered);
  }
}
