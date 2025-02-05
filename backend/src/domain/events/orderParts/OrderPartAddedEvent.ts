import { EventShape } from "../EventShape";

export interface OrderPartAddedEvent extends EventShape<"ORDER_PART_ADDED", 1, {
  orderId: string;
  partId: string;
  quantityOrdered: number;
}> {}
