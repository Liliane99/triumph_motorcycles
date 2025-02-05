import { OrderPart } from "../../../domain/entities/OrderPart";

export interface IOrderPartRepository {
  addPartToOrder(orderPart: OrderPart): Promise<OrderPart>;
  updatePartInOrder(orderId: string, partId: string, quantityOrdered: number): Promise<OrderPart | null>;
  removePartFromOrder(orderId: string, partId: string): Promise<void>;
  getOrderPart(orderId: string, partId: string): Promise<OrderPart | null>;
  getPartsByOrderId(orderId: string): Promise<OrderPart[]>;
}
