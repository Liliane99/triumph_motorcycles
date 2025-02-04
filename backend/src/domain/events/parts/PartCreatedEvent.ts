import { EventShape } from "../EventShape";

export interface PartCreatedEvent extends EventShape<"PART_CREATED", 1, {
  id: string;
  reference: string;
  type: string;
  name: string;
  quantityInStock: number;
  partThreshold: number;
  unitPrice: number;
  createdAt: Date;
  createdBy: string;
}> {}
