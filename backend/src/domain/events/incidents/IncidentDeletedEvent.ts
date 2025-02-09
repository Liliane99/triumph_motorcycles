import { EventShape } from "../EventShape";

export interface IncidentDeletedEvent extends EventShape<"INCIDENT_DELETED", 1, {
  id: string;
}> {}
