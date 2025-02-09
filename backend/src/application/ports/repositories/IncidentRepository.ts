import { Incident } from "../../../domain/entities/Incident";

export interface IncidentRepository {
  save(incident: Incident): Promise<Incident>;
  findById(id: string): Promise<Incident | null>;
  getAll(): Promise<Incident[]>;
  delete(id: string): Promise<void>;
}
