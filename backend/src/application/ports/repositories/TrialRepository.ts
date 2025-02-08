import { Trial } from "../../../domain/entities/Trial";

export interface ITrialRepository {
  createTrial(trial: Trial): Promise<Trial>;
  updateTrial(trial: Trial): Promise<Trial | null>;
  deleteTrial(userId: string, motorcycleId: string): Promise<void>;
  getTrialById(userId: string, motorcycleId: string): Promise<Trial | null>;
  listTrials(): Promise<Trial[]>;
  getTrialsByUserId(userId: string): Promise<Trial[]>;
  getTrialsByMotorcycleId(motorcycleId: string): Promise<Trial[]>;
}
