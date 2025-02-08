import { Driver } from "../../../domain/entities/Driver";

export interface DriverRepository {
  save(driver: Driver): Promise<Driver>;
  findById(id: string): Promise<Driver | null>;
  getAll(): Promise<Driver[]>;
  delete(id: string): Promise<void>;
}
