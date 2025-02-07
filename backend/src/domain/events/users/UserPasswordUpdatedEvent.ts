import { EventShape } from "../EventShape";

export interface UserPasswordUpdatedEvent extends EventShape<"USER_PASSWORD_UPDATED", 1, {
  id: string;
  updatedAt: Date;
  updatedBy: string;
}> {}
