import { EventShape } from "../EventShape";

export interface PartDeletedEvent extends EventShape<"PART_DELETED", 1, {
  id: string;
  // deletedAt: Date;
  // deletedBy: string;
}> {}
