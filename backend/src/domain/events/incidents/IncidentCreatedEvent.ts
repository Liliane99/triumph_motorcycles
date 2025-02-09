import { EventShape } from "../EventShape";

export interface IncidentCreatedEvent extends EventShape<"INCIDENT_CREATED", 1, {
  id: string;
  reference: string;
  description: string;
  status: string; 
  date: Date;
  motorcycleId: string;
  createdAt: Date;
  createdBy: string;
}> {}
