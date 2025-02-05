import { EventShape } from "../EventShape";

export interface OrderDeletedEvent extends EventShape<"ORDER_DELETED", 1, {
  id: string;
}> {}
