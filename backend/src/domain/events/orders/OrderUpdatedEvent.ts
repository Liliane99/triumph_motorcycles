import { EventShape } from "../EventShape";

export interface OrderUpdatedEvent extends EventShape<"ORDER_UPDATED", 1, {
  id: string;
  orderDate: Date;
  deliveryDate?: Date | null;
  updatedAt: Date;
  updatedBy: string;
}> {}
