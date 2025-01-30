import { Moto } from "../entities/Motorcycle";

export interface MotoRepository {
  create(moto: Moto): Promise<Moto>;
  findById(id: string): Promise<Moto | null>;
  findAll(): Promise<Moto[]>;
  update(moto: Moto): Promise<Moto | null>;
  delete(id: string): Promise<boolean>;
}
