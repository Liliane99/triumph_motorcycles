import { EventShape } from "../EventShape";

export interface MaintenanceUpdatedEvent extends EventShape<"MAINTENANCE_UPDATED", 1, {
  id: string;
  date: Date; 
  recommendation: string;
  updatedBy: string;
  updatedAt: Date;
}> {}
