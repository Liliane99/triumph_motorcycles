import { Rental } from "../../../domain/entities/Rental";

export interface RentalRepository {
  save(rental: Rental): Promise<Rental>;
  findById(id: string): Promise<Rental | null>;
  getAll(): Promise<Rental[]>;
  delete(id: string): Promise<void>;
}
