import { EventShape } from "../EventShape";

export interface TrialUpdatedEvent extends EventShape<"TRIAL_UPDATED", 1, {
  userId: string;
  motorcycleId: string;
  startDate?: Date;
  endDate?: Date;
  updatedBy: string;
  updatedAt: Date;
}> {}
