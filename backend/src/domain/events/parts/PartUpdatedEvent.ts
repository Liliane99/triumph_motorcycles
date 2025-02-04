import { EventShape } from "../EventShape";

export interface PartUpdatedEvent extends EventShape<"PART_UPDATED", 1, {
  id: string;
  reference?: string;
  type?: string;
  name?: string;
  quantityInStock?: number;
  partThreshold?: number;
  unitPrice?: number;
  updatedAt: Date;
  updatedBy: string;
}> {}
