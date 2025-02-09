import { EventShape } from "../EventShape";

export interface MaintenancePartRemovedEvent extends EventShape<"MAINTENANCE_PART_REMOVED", 1, {
  maintenanceId: string;
  partId: string;
  quantityRemoved: number;
}> {}
