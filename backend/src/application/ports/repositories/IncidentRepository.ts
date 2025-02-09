import { Incident } from "../../../domain/entities/Incident";

export interface IIncidentRepository {
  createIncident(incident: Incident): Promise<Incident>;
  updateIncident(incident: Incident): Promise<Incident | null>;
  deleteIncident(id: string): Promise<void>;
  getIncidentById(id: string): Promise<Incident | null>;
  getIncidentByReference(reference: string): Promise<Incident | null>;
  listIncidents(): Promise<Incident[]>;
}
