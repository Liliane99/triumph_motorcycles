import { Maintenance } from "../../../domain/entities/Maintenance";

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<Maintenance>;
  findById(id: string): Promise<Maintenance | null>;
  getAll(): Promise<Maintenance[]>;
  delete(id: string): Promise<void>;

}
