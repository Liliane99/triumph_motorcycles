import { EventShape } from "../EventShape";

export interface MaintenanceDeletedEvent extends EventShape<"MAINTENANCE_DELETED", 1, {
  id: string;
}> {}
