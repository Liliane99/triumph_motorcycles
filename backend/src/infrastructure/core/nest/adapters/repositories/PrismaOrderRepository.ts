import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IOrderRepository } from "../../../../../application/ports/repositories/OrderRepository";
import { Order } from "../../../../../domain/entities/Order";
import { Order as PrismaOrder } from "@prisma/client";
import { OrderReference } from "../../../../../domain/values/orders/OrderReference";
import { OrderDate } from "../../../../../domain/values/orders/OrderDate";
import { DeliveryDate } from "../../../../../domain/values/orders/DeliveryDate";

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(order: Order): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
      data: {
        order_id: order.id,
        order_reference: order.reference.value,
        order_date: order.orderDate.value,
        delivery_date: order.deliveryDate ? order.deliveryDate.value : null,
        created_by: order.createdBy,
        updated_by: order.updatedBy,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      },
    });

    return this.mapToDomain(createdOrder);
  }

  async updateOrder(order: Order): Promise<Order | null> {
    const updatedOrder = await this.prisma.order.update({
      where: { order_id: order.id },
      data: {
        order_date: order.orderDate.value,
        delivery_date: order.deliveryDate ? order.deliveryDate.value : null,
        updated_by: order.updatedBy,
        updated_at: new Date(),
      },
    });

    return updatedOrder ? this.mapToDomain(updatedOrder) : null;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { order_id: id },
    });

    return order ? this.mapToDomain(order) : null;
  }
  
 
  async getOrderByReference(reference: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { order_reference: reference },
    });

    return order ? this.mapToDomain(order) : null;
  }

  async listOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany();
    return orders.map((order) => this.mapToDomain(order));
  }

  async deleteOrder(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { order_id: id } });
  }

  private mapToDomain(order: PrismaOrder): Order {
    const validReference = OrderReference.from(order.order_reference);
    const validOrderDate = OrderDate.from(order.order_date);
    const validDeliveryDate = order.delivery_date ? DeliveryDate.from(order.order_date, order.delivery_date) : null;

    if (validReference instanceof Error || validOrderDate instanceof Error || (validDeliveryDate instanceof Error && validDeliveryDate !== null)) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers Order");
    }

    return new Order(
      order.order_id,
      validReference,
      validOrderDate,
      validDeliveryDate,
      order.created_by ?? "system",
      order.updated_by ?? "system",
      new Date(order.created_at),
      new Date(order.updated_at),
    );
  }
}
