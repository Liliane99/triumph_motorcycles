import { EventShape } from "../EventShape";

export interface MaintenanceCreatedEvent extends EventShape<"MAINTENANCE_CREATED", 1, {
  id: string;
  reference: string;
  date: Date;
  recommendation: string;
  motorcycleId: string;
  createdAt: Date;
  createdBy: string;
}> {}
