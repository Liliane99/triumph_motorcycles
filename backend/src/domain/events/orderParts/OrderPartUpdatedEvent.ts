import { EventShape } from "../EventShape";

export interface OrderPartUpdatedEvent extends EventShape<"ORDER_PART_UPDATED", 1, {
  orderId: string;
  partId: string;
  quantityOrdered: number;
}> {}
