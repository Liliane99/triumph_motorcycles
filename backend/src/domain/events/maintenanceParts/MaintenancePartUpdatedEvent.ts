import { EventShape } from "../EventShape";

export interface MaintenancePartUpdatedEvent extends EventShape<"MAINTENANCE_PART_UPDATED", 1, {
  maintenanceId: string;
  partId: string;
  quantityUsed: number;
}> {}
