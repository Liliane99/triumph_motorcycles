import { EventShape } from "../EventShape";

export interface TrialDeletedEvent extends EventShape<"TRIAL_DELETED", 1, {
  userId: string;
  motorcycleId: string;
}> {}
