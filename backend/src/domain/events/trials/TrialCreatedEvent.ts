import { EventShape } from "../EventShape";

export interface TrialCreatedEvent extends EventShape<"TRIAL_CREATED", 1, {
  userId: string;
  motorcycleId: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
}> {}
