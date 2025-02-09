import { Maintenance } from "../../../domain/entities/Maintenance";

export interface IMaintenanceRepository {
  createMaintenance(maintenance: Maintenance): Promise<Maintenance>;
  updateMaintenance(maintenance: Maintenance): Promise<Maintenance | null>;
  deleteMaintenance(id: string): Promise<void>;
  getMaintenanceById(id: string): Promise<Maintenance | null>;
  getMaintenanceByReference(reference: string): Promise<Maintenance | null>;
  listMaintenances(): Promise<Maintenance[]>;
}
