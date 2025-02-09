import { EventShape } from "../EventShape";

export interface IncidentUpdatedEvent extends EventShape<"INCIDENT_UPDATED", 1, {
  id: string;
  reference?: string;
  description?: string;
  status?: string;
  updatedAt: Date;
  updatedBy: string;
}> {}
