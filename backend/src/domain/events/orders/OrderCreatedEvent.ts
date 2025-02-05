import { EventShape } from "../EventShape";

export interface OrderCreatedEvent extends EventShape<"ORDER_CREATED", 1, {
  id: string;
  reference: string;
  orderDate: Date;
  deliveryDate?: Date | null;
  createdAt: Date;
  createdBy: string;
}> {}
