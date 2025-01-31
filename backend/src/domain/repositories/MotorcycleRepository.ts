import { Motorcycle } from '../entities/Motorcycle';

export interface MotorcycleRepository {
  save(motorcycle: Motorcycle): Promise<Motorcycle>;
  findById(id: string): Promise<Motorcycle | null>;
  getAll(): Promise<Motorcycle[]>;
  delete(id: string): Promise<void>;
}
