import { Order } from "../../../domain/entities/Order";

export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  updateOrder(order: Order): Promise<Order | null>;
  deleteOrder(id: string): Promise<void>;
  getOrderById(id: string): Promise<Order | null>;
  getOrderByReference(reference: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
}
