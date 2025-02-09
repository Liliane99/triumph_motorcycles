import { MaintenancePart } from "../../../domain/entities/MaintenancePart";

export interface IMaintenancePartRepository {
  addPartToMaintenance(maintenancePart: MaintenancePart): Promise<MaintenancePart>;
  updatePartInMaintenance(maintenanceId: string, partId: string, quantityUsed: number): Promise<MaintenancePart | null>;
  removePartFromMaintenance(maintenanceId: string, partId: string): Promise<void>;
  getMaintenancePart(maintenanceId: string, partId: string): Promise<MaintenancePart | null>;
  getPartsByMaintenanceId(maintenanceId: string): Promise<MaintenancePart[]>;
}
