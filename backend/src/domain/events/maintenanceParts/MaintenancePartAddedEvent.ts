import { EventShape } from "../EventShape";

export interface MaintenancePartAddedEvent extends EventShape<"MAINTENANCE_PART_ADDED", 1, {
  maintenanceId: string;
  partId: string;
  quantityUsed: number;
}> {}
