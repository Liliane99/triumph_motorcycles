import { EventShape } from "../EventShape";

export interface OrderPartRemovedEvent extends EventShape<"ORDER_PART_REMOVED", 1, {
  orderId: string;
  partId: string;
  quantityRemoved: number; 
}> {}
